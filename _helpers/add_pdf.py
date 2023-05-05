import os
import glob
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.elastic_vector_search import ElasticVectorSearch
from langchain.document_loaders import DirectoryLoader
from langchain.text_splitter import LatexTextSplitter
import time

ELASTIC_PW = os.environ.get("ELASTICSEARCH_PASSWORD")
HOST = f"https://elastic:{ELASTIC_PW}@llm-vectorstore.es.us-east1.gcp.elastic-cloud.com"
PORT = 9243
if not ELASTIC_PW:
    raise ValueError(
        "Please set the environment variable ELASTICSEARCH_PASSWORD")


dataset_name = "cfa_level_1_latex"
file_list = glob.glob("./docs/Level-1/*/*.tex")
embeddings = OpenAIEmbeddings()

conn = ElasticVectorSearch(
    elasticsearch_url=f'{HOST}:{PORT}',
    index_name=f'{dataset_name}',
    embedding=embeddings,
)


def main():
    # path = "docs/Kaplan 2020 CFA Level II Schweser Notes eBook 1-2020.pdf"
    latex_splitter = LatexTextSplitter(chunk_size=1500, chunk_overlap=0)
    for file in file_list:
        with open(file) as f:
            text = f.read()

        docs = latex_splitter.create_documents([text])
        print(f"Split {len(docs)} documents from {file}")
        conn.add_documents(docs)
        time.sleep(5)

        print(f"\nAdded {len(docs)} documents from {file}")

    return None


if __name__ == "__main__":
    main()
