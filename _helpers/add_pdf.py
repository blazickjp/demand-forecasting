import os
import redis
from langchain.document_loaders import PyPDFLoader
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.elastic_vector_search import ElasticVectorSearch


HOST = "https://elastic:4H7MC7XFTOJTDQu9b5CCAxM2@llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
PORT = 9243
url = f"{HOST}:{PORT}"
embeddings = OpenAIEmbeddings()

# conn.add_documents([{"id": 1, "text": "This is a test document"},])


def main():
    path = "docs/Kaplan 2020 CFA Level II Schweser Notes eBook 1-2020.pdf"
    dataset_name = "kaplan_cfa_level_2_book_1"
    loader = PyPDFLoader(path)
    docs = loader.load_and_split()
    print(f'{len(docs)}')

    conn = ElasticVectorSearch(
        elasticsearch_url=f'{HOST}:{PORT}',
        index_name=f'{dataset_name}',
        embedding=embeddings
    )
    print("Connected to ElasticSearch")

    conn.add_documents(docs)

    return


if __name__ == "__main__":
    main()
