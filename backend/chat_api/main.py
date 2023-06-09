from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import redis

import os
import json
from langchain.vectorstores import DeepLake, ElasticVectorSearch
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.chains.question_answering import load_qa_chain
from langchain.memory import ConversationBufferMemory
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.prompts.prompt import PromptTemplate
from langchain.schema import BaseMessage
from langchain.agents import Tool, load_tools
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent
from langchain.agents import AgentType

template = """
You are MindSproutAI. An AI specifically designed to help people study for very important
upcoming exams. You will always try to help the student understand complicated topics and
explain your answers step by step. If MindSproutAI does not know the answer to a question,
it truthfully says it does not know and will not hallucinate. Rely on the material found
in the CONTEXT section to answer student questions.

CONTEXT: {context}
Current conversation:
{chat_history}
Student: {question}
MindSproutAI:
"""

qa_template = """Given the following extracted parts of a long text and question, create a final answer with references ("SOURCES").
If you don't know the answer, just say that you don't know. Do not try to make up an answer.
ALWAYS return a "SOURCES" part in your answer.

QUESTION: {question}
======
{summaries}
======
FINAL ANSWER:"""
QA_PROMPT = PromptTemplate(template=qa_template, input_variables=[
                           "summaries", "question"])
# DOC_PROMPT = PromptTemplate(
#     template="",
#     input_variables=["page_content", "source"])

# from langchain.document_loaders import PyPDFLoader
# from langchain.embeddings.openai import OpenAIEmbeddings


class BadRequestError(Exception):
    pass


class MissingUserIdError(BadRequestError):
    pass


class MissingDatasetError(BadRequestError):
    pass


class MissingQuestionError(BadRequestError):
    pass


class LlmAnswerRequest(BaseModel):
    user_id: str
    dataset: str
    question: str


class ClearCacheRequest(BaseModel):
    user_id: str
    cache_type: str


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_deeplake_instances = {}
embeddings = OpenAIEmbeddings()


ELASTIC_PW = os.environ.get("ELASTIC_PW")
HOST = f"https://elastic:{ELASTIC_PW}@llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
PORT = 9243


@app.get("/")
def hello_world():
    return "Hello, World!"


@app.post("/llm_answer")
def llm_answer(request_data: LlmAnswerRequest):

    if request_data is None:
        raise BadRequestError("Invalid request data")

    question = request_data.question
    user_id = request_data.user_id
    dataset = request_data.dataset

    if user_id is None:
        raise MissingUserIdError("No user_id provided")

    if dataset is None:
        raise MissingDatasetError("No dataset provided")

    if question is None:
        raise MissingQuestionError("No question provided")

    if user_id not in user_deeplake_instances or user_deeplake_instances[user_id]["dataset"] != dataset:
        print("\n\n** Creating new DataLake instance **\n\n")
        user_db = ElasticVectorSearch(
            elasticsearch_url=f"{HOST}:{PORT}",
            index_name=dataset,
            embedding=embeddings,
        )

        memory = ConversationBufferMemory(
            memory_key="chat_history", return_messages=True)

        model = OpenAI()

        qa_chain = load_qa_with_sources_chain(
            model,
            chain_type="stuff",
            prompt=QA_PROMPT,
            # document_prompt=DOC_PROMPT
        )
        retriever = user_db.as_retriever()
        chain = RetrievalQAWithSourcesChain(
            combine_documents_chain=qa_chain,
            retriever=retriever,
            reduce_k_below_max_tokens=True,
            max_tokens_limit=1500,
            return_source_documents=True
        )

        # tools = load_tools(["llm-math"], llm=OpenAI())
        tools = []
        search = Tool(
            name="Search",
            func=chain,
            description="useful for retrieving information from a relevant database of documents"
        )
        tools.append(search)

        agent_chain = initialize_agent(
            tools,
            ChatOpenAI(temperature=0),
            agent=AgentType.CHAT_CONVERSATIONAL_REACT_DESCRIPTION,
            verbose=True,
            memory=memory
        )

        user_deeplake_instances[user_id] = {
            "dataset": dataset,
            "memory": memory,
            "agent": agent_chain,
        }

    # user_db = user_deeplake_instances[user_id]["instance"]
    # mem = user_deeplake_instances[user_id]["memory"]
    # prompt = user_deeplake_instances[user_id]["prompt_template"]

    # docs = user_db.search(question)

    # model = OpenAI(model="text-davinci-003", max_tokens=1024,
    #                temperature=0, request_timeout=180)

    # doc_chain = StuffDocumentsChain(
    #     llm_chain=llm_chain,
    #     document_variable_name="context",
    #     output_key="answer",
    #     verbose=True
    # )
    print("\n\n** Getting Memory **\n\n")
    current_memory = user_deeplake_instances[user_id]["memory"]

    print(user_deeplake_instances.keys())
    print("\n\n** Running Agent **")
    agent = user_deeplake_instances[user_id].get("agent")
    if agent is None:
        raise BadRequestError("No agent found")
    print("Question: ", question, "\n")
    answer = agent.run(input=question)
    print(answer)

    return {"answer": answer.replace("Student", user_id)}


@app.post("/clear_cache")
def clear_cache(request_data: ClearCacheRequest):

    if request_data is None:
        raise HTTPException(status_code=400, detail="Invalid request data")

    cache_type = request_data.cache_type
    user_id = request_data.user_id

    if user_id is None:
        raise HTTPException(status_code=400, detail="Missing User ID")
    if cache_type is None:
        raise HTTPException(status_code=400, detail="Missing Cache Type")

    if cache_type == 'memory':
        try:
            user_deeplake_instances[user_id]["memory"].chat_memory.clear()
        except:
            print("Memory not Found")
            return {'warning': 'User not found'}
        print("Memory Removed")
        return {'message': 'Memory cache cleared'}
    elif cache_type == 'user':
        try:
            user_deeplake_instances.pop(user_id)
        except:
            print("User not Found")
            return {'warning': 'User not found'}
        print("User Removed")
        return {'message': 'User cache cleared'}
    else:
        raise HTTPException(status_code=400, detail="Invalid cache type")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8888)
