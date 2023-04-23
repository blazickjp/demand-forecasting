from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import json
from langchain.vectorstores import DeepLake
from langchain.chat_models import ChatOpenAI
from langchain.chains import ChatVectorDBChain
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings.openai import OpenAIEmbeddings

DEEPLAKE_ACCOUNT_NAME = os.getenv("DEEPLAKE_ACCOUNT_NAME")
DEEPLAKE_TOKEN = os.getenv("DEEPLAKE_TOKEN")

app = Flask(__name__)
CORS(app)

db = DeepLake(
    dataset_path=f"hub://{DEEPLAKE_ACCOUNT_NAME}/bayesian_data_analysis",
    token=DEEPLAKE_TOKEN,
    read_only=True
)
retriever = db.as_retriever()
retriever.search_kwargs['distance_metric'] = 'cos'
retriever.search_kwargs['fetch_k'] = 20
retriever.search_kwargs['maximal_marginal_relevance'] = True
retriever.search_kwargs['k'] = 4


@app.route("/llm_answer", methods=["POST", "OPTIONS"])
@cross_origin()
def llm_answer(request):
    if request.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
        }
        return ("", 204, headers)
    request_data = request.get_json()
    question = request_data.get("question", "No question provided")

    # pdf_file = request.files['file']

    # loader = PyPDFLoader(pdf_file)
    # docs = loader.load_and_split()
    # print(f'{len(docs)}')
    if question == "No question provided":
        return jsonify({"answer": "No question provided"})

    model = ChatOpenAI(model='gpt-3.5-turbo', max_tokens=500, temperature=0)
    qa = ChatVectorDBChain.from_llm(
        vectorstore=db, llm=model, top_k_docs_for_context=3)
    answer = qa({"question": question, "chat_history": ""})
    print(answer)

    # Set CORS headers for the main request
    # headers = {
    #     "Access-Control-Allow-Origin": "*",
    # }

    return jsonify({"answer": answer})


if __name__ == "__main__":
    app.run()
