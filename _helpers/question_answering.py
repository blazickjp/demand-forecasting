from langchain.agents import Tool, AgentExecutor, BaseSingleActionAgent
from langchain.schema import AgentAction, AgentFinish
from langchain.embeddings import OpenAIEmbeddings
from langchain import OpenAI, SerpAPIWrapper, LLMMathChain
from langchain.vectorstores.elastic_vector_search import ElasticVectorSearch
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
import os

ELASTIC_PW = os.environ.get("ELASTICSEARCH_PASSWORD")
HOST = f"https://elastic:{ELASTIC_PW}@llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
PORT = 9243
if not ELASTIC_PW:
    raise ValueError(
        "Please set the environment variable ELASTICSEARCH_PASSWORD")

INDEX_NAME = "cfa_level_1_latex"

embeddings = OpenAIEmbeddings()
conn = ElasticVectorSearch(
    elasticsearch_url=f'{HOST}:{PORT}',
    index_name=INDEX_NAME,
    embedding=embeddings,
)

# Set up Firebase
cred = credentials.Certificate('cfa-creds.json')
firebase_admin.initialize_app(cred)
db = firestore.client()
ref = db.reference('questions')

# Set up LLM Math Chaina
llm = OpenAI(temperature=0)
llm_math = LLMMathChain.from_llm(llm, verbose=True)

# Define your tools
tools = [
    Tool(
        name="Search",
        # Use the similarity_search method of ElasticVectorSearch
        func=elastic_vector_search.similarity_search,
        description="useful for searching the CFA study material",
        return_direct=True
    ),
    Tool(
        name="Math",
        func=llm_math.run,  # Use the run method of LLMMathChain
        description="useful for executing math",
        return_direct=True
    )
]


class CFAStudyAgent(BaseSingleActionAgent):
    @property
    def input_keys(self):
        return ["input"]

    def plan(self, intermediate_steps, **kwargs):
        # Here you would implement the logic for deciding which action to take
        # For example, if the question involves math, use the Math tool
        if 'math' in kwargs["input"]:
            return AgentAction(tool="Math", tool_input=kwargs["input"], log="")
        else:
            return AgentAction(tool="Search", tool_input=kwargs["input"], log="")

    async def aplan(self, intermediate_steps, **kwargs):
        # The async version of the plan method
        if 'math' in kwargs["input"]:
            return AgentAction(tool="Math", tool_input=kwargs["input"], log="")
        else:
            return AgentAction(tool="Search", tool_input=kwargs["input"], log="")


# Loop through the questions in the Firebase database
for question in ref.get():
    agent_executor = AgentExecutor.from_agent_and_tools(
        agent=CFAStudyAgent(), tools=tools, verbose=True)
    answer = agent_executor.run(question)
    print(f"Question: {question}")
    print(f"Answer: {answer}")
