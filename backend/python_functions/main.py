from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import json
from langchain.vectorstores import DeepLake
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts.prompt import PromptTemplate

template = """
You are MindSproutAI. An AI specifically designed to help people study for very important
upcoming exams. You will always try to help the student understand complicated topics and
explain answers using step by step reasoning. You can always ask the student clarifying questions
if it helps you answer questions. If MindSproutAI does not know the answer to a question, 
it truthfully says it does not know and will not hallucinate.

Current conversation:
{chat_history}
Student: {question}
MindSproutAI:
"""
PROMPT = PromptTemplate(
    input_variables=["chat_history", "question"], template=template
)


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
print(DEEPLAKE_TOKEN)

app = Flask(__name__)
CORS(app)

user_deeplake_instances = {}

print(f'Dataset_path: hub://{DEEPLAKE_ACCOUNT_NAME}/bayesian_data_analysis')

db = DeepLake(
    dataset_path=f'hub://{DEEPLAKE_ACCOUNT_NAME}/bayesian_data_analysis',
    token=DEEPLAKE_TOKEN,
    read_only=True
)

retriever = db.as_retriever()
retriever.search_kwargs['distance_metric'] = 'cos'
retriever.search_kwargs['fetch_k'] = 20
retriever.search_kwargs['maximal_marginal_relevance'] = True
retriever.search_kwargs['k'] = 4


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
        user_deeplake_instances[user_id] = {
            "dataset": dataset,
            "instance": DeepLake(
                dataset_path=f"hub://{DEEPLAKE_ACCOUNT_NAME}/{dataset}",
                token=DEEPLAKE_TOKEN,
                read_only=True
            ),
            "memory": ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )
        }

    user_db = user_deeplake_instances[user_id]["instance"]
    mem = user_deeplake_instances[user_id]["memory"]

    retriever = user_db.as_retriever()
    retriever.search_kwargs['distance_metric'] = 'cos'
    retriever.search_kwargs['fetch_k'] = 20
    retriever.search_kwargs['maximal_marginal_relevance'] = True
    retriever.search_kwargs['k'] = 4

    model = ChatOpenAI(model='gpt-3.5-turbo', max_tokens=500, temperature=0)
    # qa = ChatVectorDBChain.from_llm(
    #     vectorstore=user_db, llm=model, top_k_docs_for_context=3)
    # answer = qa({"question": question, "chat_history": ""})
    # print(answer)

    qa = ConversationalRetrievalChain.from_llm(
        llm=model,
        retriever=retriever,
        memory=mem,
        verbose=True
    )

    answer = qa({"question": question})
    print(answer["answer"])
    return jsonify({"answer": answer["answer"]})


@app.errorhandler(BadRequestError)
def handle_bad_request_error(error):
    response = jsonify({"error": str(error)})
    response.status_code = 400
    return response


if __name__ == "__main__":
    app.run(port='8888', debug=True)
    # app.run()
