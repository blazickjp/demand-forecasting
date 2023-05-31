import os
from typing import List
from langchain.prompts import StringPromptTemplate
from langchain.agents import Tool, AgentExecutor, BaseSingleActionAgent, ZeroShotAgent
from langchain.schema import AgentAction, AgentFinish
from langchain.embeddings import OpenAIEmbeddings
from langchain import OpenAI, SerpAPIWrapper, LLMMathChain, PromptTemplate, LLMChain
from langchain.vectorstores.elastic_vector_search import ElasticVectorSearch
import firebase_admin
import json
from firebase_admin import credentials, firestore

ELASTIC_PW = os.environ.get("ELASTICSEARCH_PASSWORD")
HOST = f"https://elastic:{ELASTIC_PW}@llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
PORT = 9243
if not ELASTIC_PW:
    raise ValueError(
        "Please set the environment variable ELASTICSEARCH_PASSWORD")

INDEX_NAME = "cfa_level_1_latex"

embeddings = OpenAIEmbeddings()
elastic_vector_search = ElasticVectorSearch(
    elasticsearch_url=f'{HOST}:{PORT}',
    index_name=INDEX_NAME,
    embedding=embeddings,
)

DOC_SUMMARY_PROMPT = """
You are an expert at extracting key pieces of information from a larger body of text
and presenting them in a concise manner. Your responses are honest, relevant and help the
end user answer their question. You NEVER make up answers and will respond with "I do not know" 
when you are unsure. You are only ever presented with a document and a question. God speed.

The format will be as follows:
Document: What should be relevant information to the question which was found via similarity search
Question: The question which was asked
Response: Your response should be a consise brief of the informaton you found relevant to the question.

Document: {document}
Question: {question}
Response:
"""

# Set up Firebase
cred = credentials.Certificate('cfa-creds.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
col_ref = db.collection('questions')
# Stream the documents in the collection
docs = col_ref.stream()

# Set up LLM Math Chaina
llm = OpenAI(temperature=0)
llm_math = LLMMathChain.from_llm(llm, verbose=True)

def search_and_summarize(query: str) -> str:
    # Search the web for the query
    docs = elastic_vector_search.similarity_search(query)
    full_docs = ""
    for i in docs:
        full_docs += i.page_content

    # Summarize the text
    ans = summarize_chain.predict(document=full_docs, question=query)
    print("******\n\n", full_docs, "\n\n******")
    print("******\n\n", ans, "\n\n******")
    return ans

# Create a prompt template for text summarization
# Create an LLMChain for text summarization using the OpenAI language model and the prompt template
summarize_prompt = PromptTemplate(template=DOC_SUMMARY_PROMPT, input_variables=["document", "question"])
summarize_chain = LLMChain(llm=OpenAI(temperature=0.3), prompt=summarize_prompt)

llm_math = LLMMathChain.from_llm(llm, verbose=True)


# Define your tools
tools = [
    Tool(
        name="Search_and_Filter",
        func=search_and_summarize,
        description="Returns sections of the CFA cirriculum that are similar to the input, useful for searching for answers to questions",
        # return_direct=True
    ),
    Tool(
        name="Math",
        func=llm_math.run,
        description="Returns the answer to a math question.",
    )
]


class CFAStudyAgent(BaseSingleActionAgent):
    @property
    def input_keys(self):
        return ["input"]

    def plan(self, intermediate_steps, **kwargs):
        # Here you would implement the logic for deciding which action to take
        # For example, if the question involves math, use the Math tool
        return AgentAction(tool="Search_and_Filter", tool_input=kwargs["input"], log="")

    async def aplan(self, intermediate_steps, **kwargs):
        # The async version of the plan method
        if 'math' in kwargs["input"]:
            return AgentAction(tool="Math", tool_input=kwargs["input"], log="")
        else:
            return AgentAction(tool="Search", tool_input=kwargs["input"], log="")

# Set up a prompt template

AGENT_PREFIX = """
You are an expert at explaining CFA solutions to students currently studying for the CFA exam.
You will be presented with a CFA Question in json format. Answer the question and provide step by step
instructions on how you came to your answer.
You have access to the following tools:"""

AGENT_FORMAT_INSTRUCTIONS = """"
Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I can now provide the final answer with detailed explainations
STEP 1:"""

AGENT_SUFFIX = """
Question: {input}
{agent_scratchpad}
"""
# AGENT_PROMPT = ZeroShotAgent.create_prompt(prefix="", suffix="Question: {input}\n{agent_scratchpad}", tools=tools, input_variables=["input", "agent_scratchpad"])
AGENT_PROMPT = ZeroShotAgent.create_prompt(
    prefix=AGENT_PREFIX, 
    suffix=AGENT_SUFFIX, 
    format_instructions=AGENT_FORMAT_INSTRUCTIONS, 
    tools=tools, 
    input_variables=["input", "agent_scratchpad"]
)
agent_chain = LLMChain(llm=OpenAI(temperature=0.3), prompt=AGENT_PROMPT)
tool_names = [tool.name for tool in tools]
agent = ZeroShotAgent(llm_chain=agent_chain, allowed_tools=tool_names, verbose=True)
agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent, tools=tools, verbose=True)

# Loop through the questions in the Firebase database
for doc in docs:
    doc = doc.to_dict()
    if doc['parsed_question']['id'] != "335bc0e2-f18d-4ca6-8343-06fcc136a57f":
        continue

    input_question = {key: value for key, value in doc["parsed_question"].items() if key in ["question", "options", "data"]}
    # This all returns the most relevamnt docs from the ElasticSearch index
    # They can then be fed into a custom prompt to answer the question
    agent_executor.run(input=json.dumps(input_question))
    break
