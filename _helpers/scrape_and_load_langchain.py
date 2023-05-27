import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from langchain.document_loaders import WebBaseLoader
import chromadb
import pickle
import os
import json
import openai
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
from retry import retry
import time

MODEL_NAME = 'gpt-3.5-turbo'
PROMPT_PREFIX = '''
In this task, we're going to explore the structure and functionality of a Python class. I'll provide you with a Python class definition, and your job is to produce a JSON-like output that details its description, properties, methods, and dependencies.

You should include:

Class name
Description: A thorough description of the class's purpose.
Properties: The class's instance variables. For each property, list its name and provide a detailed description of its purpose or role within the class.
Methods: The class's methods. For each method, list its name, parameters, return type, and a detailed description of its functionality.
Dependencies: Any external classes or modules that the class relies on.
Here's an example of how you might structure your output:
{
  "ClassName": {
    "description": "Description of the class",
    "properties": {
      "property1": "Description of property1",
      "property2": "Description of property2"
    },
    "methods": {
      "method1": {
        "description": "Description of method1",
        "parameters": {
          "param1": "Description of param1",
          "param2": "Description of param2"
        },
        "return": "Description of return type"
      },
      "method2": {
        "description": "Description of method2",
        "parameters": {
          "param1": "Description of param1"
        },
        "return": "Description of return type"
      }
    },
    "dependencies": ["Dependency1", "Dependency2"]
  }
}

EXAMPLE:
CLASS DEFINITION:
class TokenTextSplitter(TextSplitter):
    """Implementation of splitting text that looks at tokens."""

    def __init__(
        self,
        encoding_name: str = "gpt2",
        model_name: Optional[str] = None,
        allowed_special: Union[Literal["all"], AbstractSet[str]] = set(),
        disallowed_special: Union[Literal["all"], Collection[str]] = "all",
        **kwargs: Any,
    ):
        """Create a new TextSplitter."""
        super().__init__(**kwargs)
        try:
            import tiktoken
        except ImportError:
            raise ValueError(
                "Could not import tiktoken python package. "
                "This is needed in order to for TokenTextSplitter. "
                "Please install it with `pip install tiktoken`."
            )

        if model_name is not None:
            enc = tiktoken.encoding_for_model(model_name)
        else:
            enc = tiktoken.get_encoding(encoding_name)
        self._tokenizer = enc
        self._allowed_special = allowed_special
        self._disallowed_special = disallowed_special

    def split_text(self, text: str) -> List[str]:
        """Split incoming text and return chunks."""
        splits = []
        input_ids = self._tokenizer.encode(
            text,
            allowed_special=self._allowed_special,
            disallowed_special=self._disallowed_special,
        )
        start_idx = 0
        cur_idx = min(start_idx + self._chunk_size, len(input_ids))
        chunk_ids = input_ids[start_idx:cur_idx]
        while start_idx < len(input_ids):
            splits.append(self._tokenizer.decode(chunk_ids))
            start_idx += self._chunk_size - self._chunk_overlap
            cur_idx = min(start_idx + self._chunk_size, len(input_ids))
            chunk_ids = input_ids[start_idx:cur_idx]
        return splits

RESPONSE:
{
  "TokenTextSplitter": {
    "description": "A text splitter that converts text into BPE tokens, splits these tokens into chunks, and then converts the tokens within a single chunk back into text.",
    "dependencies": {
      "modules": ["tiktoken"],
      "classes": ["TextSplitter"]
    },
    "properties": {
      "_tokenizer": {
        "type": "Unknown",
        "description": "A tokenizer instance created from the 'tiktoken' package."
      },
      "_allowed_special": {
        "type": "Union[Literal['all'], AbstractSet[str]]",
        "description": "A set of special tokens allowed in the text."
      },
      "_disallowed_special": {
        "type": "Union[Literal['all'], Collection[str]]",
        "description": "A collection of special tokens disallowed in the text."
      }
    },
    "methods": {
      "__init__": {
        "description": "Initializes the TokenTextSplitter instance.",
        "parameters": {
          "encoding_name": {
            "type": "str",
            "description": "The name of the encoding to be used. Default is 'gpt2'."
          },
          "model_name": {
            "type": "Optional[str]",
            "description": "The name of the model for which the encoding is needed. Default is None."
          },
          "allowed_special": {
            "type": "Union[Literal['all'], AbstractSet[str]]",
            "description": "A set of special tokens allowed in the text. Default is an empty set."
          },
          "disallowed_special": {
            "type": "Union[Literal['all'], Collection[str]]",
            "description": "A collection of special tokens disallowed in the text. Default is 'all'."
          },
          "kwargs": {
            "type": "Any",
            "description": "Additional keyword arguments."
          }
        }
      },
      "split_text": {
        "description": "Splits the incoming text and returns the chunks.",
        "parameters": {
          "text": {
            "type": "str",
            "description": "The text to be split."
          }
        },
        "return": {
          "type": "List[str]",
          "description": "A list of text chunks after splitting."
        }
      }
    }
  }
}
'''

PROMPT = """
CLASS DEFINITION:
{class_definition}
RESPONSE:
"""


@retry(tries=5, delay=2, backoff=2)
def convert_class_to_json(class_def: str) -> str:
    try:
        prompt = PROMPT_PREFIX + PROMPT.format(class_definition=class_def)
        response = openai.ChatCompletion.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful AI that parses unstructured text into JSON"},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0
        )
        parsed_json = json.loads(
            response['choices'][0]['message']['content'])
    except openai.ApiError as e:
        if e.status_code == 429:  # Rate limit error
            raise  # This will trigger the retry
        else:
            raise  # Some other error, don't retry
    return parsed_json


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
        self.classes.append(ast.unparse(node))
        self.generic_visit(node)

    def get_class_by_name(self, class_name: str) -> Optional[str]:
        for class_def in self.classes:
            if f"class {class_name}" in class_def:
                return class_def
        return None


class PythonClassDirectoryLoader(DirectoryLoader):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.docs = {}

    def load_file(self, item: Path, path: Path, docs: List[Document], pbar: Optional[Any]) -> None:
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
                        try:
                            class_def_json = convert_class_to_json(class_def)
                            print(class_def_json.keys())
                            self.docs.update(class_def_json)
                        except Exception as e:
                            print('Skipping class definition due to error: ', e)

                except Exception as e:
                    if self.silent_errors:
                        logger.warning(e)
                    else:
                        raise e
                finally:
                    if pbar:
                        pbar.update(1)

    def get_classes_from_file(self, file_path: str) -> List[Document]:
        return self.docs.ge(file_path, None)

    def get_classes_with_name(self, class_name: str) -> List[Document]:
        return self.docs.get(class_name, None)


embeddings = OpenAIEmbeddings()
loader = PythonClassDirectoryLoader("../../langchain", glob="**/*.py", show_progress=True, use_multithreading=False)
loader.load()
pickle.dump(loader.docs, open("docs.pkl", "wb"))
