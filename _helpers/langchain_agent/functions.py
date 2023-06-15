import os
from ClassLoader import PythonClassDirectoryLoader

class_loader = PythonClassDirectoryLoader("/Users/josephblazick/Documents/langchain", glob="**/*.py")
class_loader.load()

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