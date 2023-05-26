import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from langchain.document_loaders import WebBaseLoader
import chromadb
from langchain.embeddings import OpenAIEmbeddings
from langchain.text_splitter import TokenTextSplitter
from langchain.text_splitter import PythonCodeTextSplitter
from langchain.docstore.document import Document
from typing import List, Any
from langchain.vectorstores import Chroma
from chromadb.config import Settings
from langchain.document_loaders import UnstructuredURLLoader, ReadTheDocsLoader, DirectoryLoader, TextLoader
from pathlib import Path
import ast
from typing import List, Any, Optional
from langchain.document_loaders import DirectoryLoader
from langchain.docstore.document import Document


def _is_visible(p: Path) -> bool:
    parts = p.parts
    for _p in parts:
        if _p.startswith("."):
            return False
    return True


class ClassCollector(ast.NodeVisitor):
    def __init__(self):
        self.classes = []

    def visit_ClassDef(self, node):
        # print(f"Found class: {ast.unparse(node)}")  # Debug print
        self.classes.append(ast.unparse(node))
        self.generic_visit(node)


class PythonCodeTextSplitterWithClasses(PythonCodeTextSplitter):
    def split_text(self, text: str) -> List[str]:
        tree = ast.parse(text)
        collector = ClassCollector()
        collector.visit(tree)
        return collector.classes


class PythonClassDirectoryLoader(DirectoryLoader):
    def load_file(self, item: Path, path: Path, docs: List[Document], pbar: Optional[Any]) -> None:
        print(f"Loading {item}")
        if item.is_file():
            if _is_visible(item.relative_to(path)) or self.load_hidden:
                try:
                    # Load the Python source code
                    with open(item, 'r') as file:
                        code = file.read()

                    # Parse the code and extract class definitions
                    tree = ast.parse(code)
                    collector = ClassCollector()
                    collector.visit(tree)
                    classes = collector.classes

                    # Create a Document object for each class definition
                    for class_def in classes:
                        docs.append(Document(page_content=class_def, metadata={"file": str(item)}))

                except Exception as e:
                    if self.silent_errors:
                        logger.warning(e)
                    else:
                        raise e
                finally:
                    if pbar:
                        pbar.update(1)


embeddings = OpenAIEmbeddings()
python_splitter = PythonCodeTextSplitterWithClasses(chunk_size=30, chunk_overlap=0)
base_url = 'https://python.langchain.com/en/latest/'
persist_directory = 'db_langchain'
loader = PythonClassDirectoryLoader("../../langchain", glob="**/*.py", show_progress=True, use_multithreading=True)


raw_documents = loader.load()
docs = python_splitter.split_documents(raw_documents)
vectordb = Chroma.from_documents(documents=docs, embedding=embeddings, persist_directory=persist_directory)
vectordb.persist()


# Load the saved database
# vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
