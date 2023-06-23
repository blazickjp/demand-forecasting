# import os
import openai
import json
from MemoryManager import MemoryManager
from functions import class_lookup


GPT_MODEL = "gpt-3.5-turbo-0613"  # or any other chat model you want to use
FUNCTIONS = [class_lookup.openai_schema]


class LangChainAgent:
    def __init__(self, memory_manager, functions=None):
        self.memory_manager = memory_manager
        self.functions = functions

    def query(self, input_text, function_call="auto"):
        # Add user input to memory
        self.memory_manager.add_message("user", input_text)
        messages_without_index = [
            {k: v for k, v in item.items() if k != "interaction_index"}
            for item in self.memory_manager.messages
        ]

        # Initialize the conversation with the model
        response = openai.ChatCompletion.create(
            model=GPT_MODEL,
            messages=messages_without_index,
            functions=self.functions,
            function_call=function_call,
            max_tokens=1000,
            temperature=0.3,
        )

        message = response["choices"][0]["message"]
        # Check if the model wants to call a function
        if message.get("function_call"):
            function_name = message["function_call"]["name"]
            arguments = json.loads(message["function_call"]["arguments"])

            # Execute the function (needs to be defined before using it)
            function_response = {
                "role": "assistant",
                "content": json.dumps(obj=globals()[function_name](**arguments)),
            }

            # Add function response to memory
            messages_without_index = [
                {k: v for k, v in item.items() if k != "interaction_index"}
                for item in self.memory_manager.messages
            ]
            messages_without_index.append(function_response)

            # Continue the conversation with the function response
            second_response = openai.ChatCompletion.create(
                model=GPT_MODEL,
                messages=messages_without_index,
                max_tokens=500,
                temperature=0.7,
            )
            output_text = second_response.choices[0].message["content"].strip()
        else:
            output_text = message["content"].strip()

        # Add the output to memory
        self.memory_manager.add_message("assistant", output_text)
        return output_text


memory_manager = MemoryManager(model=GPT_MODEL)
agent = LangChainAgent(memory_manager, functions=FUNCTIONS)

response = agent.query("What's the weather like in Boston?")
# print(response)

response1 = agent.query("What is the capital of France?")
# print(response1)

response2 = agent.query("Tell me more about its history.")
# print(response2)
# print(f"Total Tokens: {agent.memory_manager.get_total_tokens()}")

response2 = agent.query(
    """
    Write a python script using the GitLoader class from Langchain to load and parse
    the files from the pandas package. Use the master branch.
"""
)
# print(response2)

print(f"Total Tokens: {agent.memory_manager.get_total_tokens()}")
print(f"Total Messages: {len(agent.memory_manager.messages)}")
memory_manager.display_conversation()
memory_manager.summarize_history()
memory_manager.display_conversation()
