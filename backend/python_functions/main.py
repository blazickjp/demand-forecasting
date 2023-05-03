## Base
import mimetypes
import os

## Model
from pydantic import BaseModel

## API
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

## Database
from uuid import uuid4
from google.cloud import storage

## LangChain
from langchain.vectorstores import ElasticVectorSearch
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

## Environment variables ##
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

user_deeplake_instances = {}
embeddings = OpenAIEmbeddings()
# find the storage client
try:
    gcs_client = storage.Client()
except:
    def find_gcs_client(filename="app-backend.json", start_path: str = "."):
        for root, _, files in os.walk(start_path):
            if filename in files:
                gcs_client = storage.Client.from_service_account_json(os.path.join(root, filename))
                return gcs_client
            
        parent_dir = os.path.dirname(os.getcwd())
        while parent_dir:
            parent_files = os.listdir(parent_dir)
            if filename in parent_files:
                gcs_client = storage.Client.from_service_account_json(os.path.join(parent_dir, filename))
                return gcs_client
            parent_dir = os.path.dirname(parent_dir)
        raise FileNotFoundError(f"Could not find {filename}")
    gcs_client = find_gcs_client()


API_KEY = gcs_client.get_bucket("fresh-oath-383101-app-auth")\
    .blob("elastic_key.json")\
    .download_as_string()\
    .decode("utf-8")
HOST = "llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
KEY_HOST = f"https://elastic:{API_KEY}@{HOST}"
print(KEY_HOST)
PORT = 9243
ELASTIC_URL = f"{KEY_HOST}:{PORT}"

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

## Functions and Classes ##
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

# data loading helpers
def is_pdf(file: UploadFile) -> bool:
    mimetype, _ = mimetypes.guess_type(file.filename)
    return mimetype == "application/pdf"

## App Routing ##
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
            elasticsearch_url=ELASTIC_URL,
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

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), user_id: str = None):
    if not is_pdf(file):
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    tmp_path = os.path.join("temp", file.filename)
    with open(tmp_path, "wb") as buffer:
        buffer.write(file.file, buffer)

    # Save the processed content to the ElasticSearch database
    #save_to_elastic(content, user_id)

    # remove the temporary file
    os.remove(tmp_path)

    return JSONResponse(content={"message": "New study materials uploaded and processed successfully."})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8888)
