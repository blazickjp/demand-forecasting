import os
import arxiv
import openai
import pandas as pd
from csv import writer


from ClassLoader import PythonClassDirectoryLoader
from retry import retry
from tenacity import retry, wait_random_exponential, stop_after_attempt



class_loader = PythonClassDirectoryLoader("/Users/josephblazick/Documents/langchain", glob="**/*.py")
class_loader.load()
EMBEDDING_MODEL = "text-embedding-ada-002"
GPT_MODEL = "gpt-3.5-turbo-0613"
# Set a directory to store downloaded papers
data_dir = os.path.join(os.curdir, "data", "papers")
paper_dir_filepath = "./data/arxiv_library.csv"

# Generate a blank dataframe where we can store downloaded files
df = pd.DataFrame(list())
df.to_csv(paper_dir_filepath)

FUNCTIONS = [
    {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {"type": "string", "description": "The city and state, e.g. San Francisco, CA"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },   
            "required": ["location"]
        }
    },
    {
        "name": "class_lookup",
        "description": "Lookup for class definitions in the langchain codebase. You should use this function when you need to see the source code related to a particular class from the langchain python package.",
        "parameters": {
            "type": "object",
            "properties": {
                "item": {"type": "string", "description": "The name of the class you want to lookup"}
            },
            "required": ["item"]
        }
    }
]


def get_current_weather(location, unit="fahrenheit"):
    """Dummy function to get the current weather in a given location"""
    weather_info = {
        "location": location,
        "temperature": "72",
        "unit": unit,
        "forecast": ["sunny", "windy"]
    }
    return weather_info # Return dictionary, not JSON string

def class_lookup(item: str):
    """
    Lookup for class definitions in the langchain codebase. You should use this function when you need to see the source code
    related to a particular class.
    """
    return class_loader.get_class(item)

@retry(wait=wait_random_exponential(min=1, max=40), stop=stop_after_attempt(3))
def embedding_request(text):
    response = openai.Embedding.create(input=text, model=EMBEDDING_MODEL)
    return response

def get_articles(query, library=paper_dir_filepath, top_k=5):
    """This function gets the top_k articles based on a user's query, sorted by relevance.
    It also downloads the files and stores them in arxiv_library.csv to be retrieved by the read_article_and_summarize.
    """
    search = arxiv.Search(
        query=query, max_results=top_k, sort_by=arxiv.SortCriterion.Relevance
    )
    result_list = []
    for result in search.results():
        result_dict = {}
        result_dict.update({"title": result.title})
        result_dict.update({"summary": result.summary})

        # Taking the first url provided
        result_dict.update({"article_url": [x.href for x in result.links][0]})
        result_dict.update({"pdf_url": [x.href for x in result.links][1]})
        result_list.append(result_dict)

        # Store references in library file
        response = embedding_request(text=result.title)
        file_reference = [
            result.title,
            result.download_pdf(data_dir),
            response["data"][0]["embedding"],
        ]

        # Write to file
        with open(library, "a") as f_object:
            writer_object = writer(f_object)
            writer_object.writerow(file_reference)
            f_object.close()
    return result_list