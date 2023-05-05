import json
import openai
import os
from langchain.vectorstores.elastic_vector_search import ElasticVectorSearch
from langchain.embeddings.openai import OpenAIEmbeddings

ELASTIC_PW = os.environ.get("ELASTICSEARCH_PASSWORD")
HOST = f"https://elastic:{ELASTIC_PW}@llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
PORT = 9243
if not ELASTIC_PW:
    raise ValueError(
        "Please set the environment variable ELASTICSEARCH_PASSWORD")

dataset_name = "cfa_level_1_latex"
embeddings = OpenAIEmbeddings()

conn = ElasticVectorSearch(
    elasticsearch_url=f'{HOST}:{PORT}',
    index_name=f'{dataset_name}',
    embedding=embeddings,
)

retriever = conn.as_retriever(search_kwargs={"k": 6})

SYSTEM_PROMPT = """
You are an AI Agent designed to generate questions for the CFA (Chartered Financial Analyst) Exam.
"""


def generate_question(objective):
    docs = retriever.get_relevant_documents(objective)
    context = ""
    for doc in docs:
        context += doc.page_content + "\n"

    user_prompt = f"""
    You will be given a LEARNING OBJECTIVE and CONTEXT from the CFA Insitute's study material and your mission is to to generate an exam question.
    RULES:
    Each question should only have one correct answer.
    The questions should be at the difficulty level and complexity of the CFA exam.

    Questions should be formatted as follows:
    1. QUESTION.
    A. Option 1
    B. Option 2
    C. Option 3

    LEARNING OBJECTIVE: {objective}
    CONTEXT: {context}
    QUESTION:
    """

    # print(user_prompt)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        temperature=1.0,
        # frequency_penalty=0.5,
        n=1
    )
    return [choice['message']['content'] for choice in response['choices']]


def generate_questions_from_learning_objectives(json_file):
    # Load the JSON object
    with open(json_file, "r") as f:
        data = json.load(f)
    # Extract the "content" section containing the learning objectives
    learning_objectives = []
    for level1 in data:
        for level2 in level1["children"]:
            learning_objectives.extend(level2["learning_objectives"])
    # Generate questions based on the learning objectives
    questions = []
    for objective in learning_objectives[50:55]:
        print(objective)
        response = generate_question(objective)
        questions.extend(response)

    return questions


# Replace 'your_json_file.json' with the path to your JSON file
questions = generate_questions_from_learning_objectives(
    "./output/level_1_volume_1.json")
for q in questions:
    print(q, "\n")
