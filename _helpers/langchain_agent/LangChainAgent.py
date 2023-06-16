import os
import openai
import json
from functions import FUNCTIONS
from MemoryManager import MemoryManager
from functions import get_current_weather, class_lookup


# git_loader = GitLoader(repo_path="/Users/josephblazick/Documents/langchain", branch="v0.0.196", file_filter=file_filter)
# package_docs = git_loader.load_and_split()

GPT_MODEL = "gpt-3.5-turbo-0613"  # or any other chat model you want to use

class LangChainAgent:
    def __init__(self, memory_manager, functions=None):
        self.memory_manager = memory_manager
        self.functions = functions
    
    def query(self, input_text, function_call="auto"):
        # Add user input to memory
        self.memory_manager.add_message("user", input_text)
        messages_without_index = [{k: v for k, v in item.items() if k != 'interaction_index'} for item in self.memory_manager.messages]
        
        # Initialize the conversation with the model
        response = openai.ChatCompletion.create(
            model=GPT_MODEL,
            messages=messages_without_index,
            functions=self.functions,
            function_call=function_call,
            max_tokens=500,
            temperature=0.7
        )

        message = response["choices"][0]["message"]

        # Check if the model wants to call a function
        if message.get("function_call"):
            function_name = message["function_call"]["name"]
            arguments = json.loads(message["function_call"]["arguments"])

            # Execute the function (needs to be defined before using it)
            function_response = {
                "role": "assistant",
                "content": json.dumps(globals()[function_name](**arguments))
            }

            # Add function response to memory
            messages_without_index = [{k: v for k, v in item.items() if k != 'interaction_index'} for item in self.memory_manager.messages]
            messages_without_index.append(function_response)

            # Continue the conversation with the function response
            second_response = openai.ChatCompletion.create(
                model=GPT_MODEL,
                messages=messages_without_index,
                max_tokens=500,
                temperature=0.7
            )
            output_text = second_response.choices[0].message["content"].strip()
        else:
            output_text = message["content"].strip()

        # Add the output to memory
        self.memory_manager.add_message("assistant", output_text)

        return output_text

memory_manager = MemoryManager(model=GPT_MODEL)
agent = LangChainAgent(memory_manager, functions=FUNCTIONS)

# response = agent.query("What's the weather like in Boston?")
# print(response)

# response1 = agent.query("What is the capital of France?")
# print(response1)

# response2 = agent.query("Tell me more about its history.")
# print(response2)

response2 = agent.query("Write a python script using the GitLoader class from Langchain? Just import and use the class.")
print(response2)

print(f"Total Tokens: {agent.memory_manager.get_total_tokens()}")
print(f"Total Messages: {len(agent.memory_manager.messages)}")
for i in agent.memory_manager.messages:
    print(i['content'])
