from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import json
from langchain.vectorstores import DeepLake
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains.qa_with_sources import load_qa_with_sources_chain
from langchain.chains.question_answering import load_qa_chain
from langchain.memory import ConversationBufferMemory
from langchain.chains import RetrievalQAWithSourcesChain
from langchain.prompts.prompt import PromptTemplate
from langchain.schema import BaseMessage
from langchain.agents import Tool
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


DEEPLAKE_ACCOUNT_NAME = os.getenv("DEEPLAKE_ACCOUNT_NAME")
DEEPLAKE_TOKEN = os.getenv("DEEPLAKE_TOKEN")

print(DEEPLAKE_ACCOUNT_NAME)

app = Flask(__name__)
CORS(app)

user_deeplake_instances = {}
embeddings = OpenAIEmbeddings()


@app.route("/", methods=["GET"])
def hello_world():
    return "Hello, World!"


@app.route("/llm_answer", methods=["POST", "OPTIONS"])
@cross_origin()
def llm_answer():
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)

    request_data = request.json

    if request_data is None:
        raise BadRequestError("Invalid request data")

    question = request_data.get("question")
    user_id = request_data.get("user_id")
    dataset = request_data.get("dataset")

    if user_id is None:
        raise MissingUserIdError("No user_id provided")

    if dataset is None:
        raise MissingDatasetError("No dataset provided")

    if question is None:
        raise MissingQuestionError("No question provided")

    if user_id not in user_deeplake_instances or user_deeplake_instances[user_id]["dataset"] != dataset:
        print("\n\n** Creating new DataLake instance **\n\n")
        user_db = DeepLake(
            dataset_path=f"hub://{DEEPLAKE_ACCOUNT_NAME}/{dataset}",
            token=DEEPLAKE_TOKEN,
            read_only=True,
            embedding_function=embeddings,
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
            max_tokens_limit=2056,
            return_source_documents=True
        )

        tools = [
            Tool(
                name="Search",
                func=chain,
                description="useful to answer factual questions"
            ),
        ]

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

    return jsonify({"answer": answer.replace("Student", user_id)})


@app.errorhandler(BadRequestError)
def handle_bad_request_error(error):
    response = jsonify({"error": str(error)})
    response.status_code = 400
    return response


@app.route("/clear_cache", methods=["POST", "OPTIONS"])
@cross_origin()
def clear_cache():
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    print("Clearing cache")
    request_data = request.json

    if request_data is None:
        raise BadRequestError("Invalid request data")

    cache_type = request_data.get("cache_type")
    user_id = request_data.get("user_id")

    if user_id is None:
        jsonify({'error': 'Missing User ID'}), 400
    if cache_type is None:
        jsonify({'error': 'Missing Cache Type'}), 400

    if cache_type == 'memory':
        try:
            user_deeplake_instances[user_id]["memory"].chat_memory.clear()
        except:
            print("Memory not Found")
            return jsonify({'warning': 'User not found'})
        print("Memory Removed")
        return jsonify({'message': 'Memory cache cleared'})
    elif cache_type == 'user':
        try:
            user_deeplake_instances.pop(user_id)
        except:
            print("User not Found")
            return jsonify({'warning': 'User not found'})
        print("User Removed")
        return jsonify({'message': 'User cache cleared'})
    else:
        return jsonify({'error': 'Invalid cache type'}), 400


if __name__ == "__main__":
    app.run(port='8888', debug=True)
    # app.run()
