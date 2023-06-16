import openai
import json
import time
import psycopg2
from uuid import uuid4
from termcolor import colored
import tiktoken

class MemoryManager:
    def __init__(self, model, max_tokens=2048):
        self.model = model
        self.max_tokens = max_tokens
        self.messages = [{"role": "system", "content": "You are a helpful AI assistant.", "interaction_index": time.time()*1000}]
        self.id = str(uuid4())
        # Connect to the PostgreSQL database
        self.conn = psycopg2.connect(
            host="localhost",
            database="memory",
            user="joe",
            password="1234"
        )

        # Create a cursor object
        self.cur = self.conn.cursor()

        # Create the table if it doesn't exist
        self.cur.execute(f'''
        CREATE TABLE IF NOT EXISTS memory (
            interaction_index BIGINT PRIMARY KEY,
            memory_item JSONB NOT NULL
        )
        ''')
        self.cur.execute("TRUNCATE memory")
        self.conn.commit()

    def add_message(self, role, content, override_truncate=False):
        timestamp = int(time.time() * 1000)  # Current timestamp in milliseconds
        self.messages.append({"role": role, "content": content, "interaction_index": timestamp})
        
        if not override_truncate:
            self.truncate_history()
        
    def truncate_history(self):
        total_tokens = sum(len(item["content"]) for item in self.messages)
        while total_tokens > self.max_tokens:
            # Check if the message to be removed is the first message and is a system message
            if len(self.messages) > 1:
                removed_item = self.messages.pop(1)  # Pop the second message instead of the first
                total_tokens -= len(removed_item["content"])
                self.archive_memory_item(removed_item)
            else:
                # If there is only the system message, do nothing.
                break

    def archive_memory_item(self, memory_item):
        interaction_index = memory_item.get("interaction_index")
        if interaction_index is not None:
            interaction_index = int(interaction_index)  # Make sure it's an integer
        else:
            interaction_index = int(time.time() * 1000)  # Default to current timestamp in milliseconds
            
        # Check if the content is already a JSON string
        if isinstance(memory_item["content"], str):
            # If it's already a JSON string, escape single quotes
            memory_item_json = json.dumps(memory_item).replace("'", "''")
        else:
            # If it's a dictionary, convert it to a JSON string
            memory_item_json = json.dumps(memory_item)
        
        # Try to insert into the database
        query = "INSERT INTO memory (interaction_index, memory_item) VALUES (%s, %s)"
        while True:
            try:
                self.cur.execute(query, (interaction_index, memory_item_json))
                self.conn.commit()
                break
            except psycopg2.errors.UniqueViolation as e:
                # If interaction_index already exists, increment it, rollback the transaction and retry
                interaction_index += 1
                self.conn.rollback()

    def summarize_history(self):
        # Combine the content of all messages into a single string
        full_history = "\n".join([f"{item['role'].capitalize()}: {item['content']}" for item in self.messages])
        
        # Use Chat API to summarize the history
        prompt = f"User: Please summarize the following conversation: \n{full_history}\n\nAssistant:"
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100  # You can adjust this value
        )

        summary = response["choices"][0]["message"]["content"].strip()

        # Clear the messages and add the summarized history as a single system message
        self.messages = [{"role": "system", "content": summary}]

    def get_memory_item(self, interaction_index):
        # Retrieve memory item by interaction index from PostgreSQL
        self.cur.execute(f"SELECT memory_item FROM memory WHERE interaction_index = {interaction_index}")
        result = self.cur.fetchone()
        if result:
            return result[0]  # Convert the JSON string back to a dictionary
        else:
            return None
    
    def get_total_tokens(self):
        """Returns the number of tokens in a text string."""
        total_tokens = 0
        for item in self.messages:
            encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
            num_tokens = len(encoding.encode(item["content"]))
            total_tokens += num_tokens
        return total_tokens
    
    def display_conversation(self, detailed=False):
        role_to_color = {
            "system": "red",
            "user": "green",
            "assistant": "blue",
            "function": "magenta",
        }
        for message in self.messages:
            print(
                colored(
                    f"{message['role']}: {message['content']}\n\n",
                    role_to_color[message["role"]],
                )
            )

    
if __name__ == "__main__":
    # Example usage:
    memory_manager = MemoryManager(model='gpt-3.5-turbo-0613')

    # Add messages with interaction indices
    memory_manager.add_message("user", "What's the weather like in Boston?")
    memory_manager.add_message("assistant", "The weather in Boston is sunny.")
    memory_manager.add_message("user", "Tell me a joke.")
    # Archive a memory item manually
    idx = int(time.time() * 1000)  # Convert to integer here as well
    memory_manager.archive_memory_item({"role": "user", "content": "This is a test message.", "interaction_index": idx})

    # Retrieve the manually archived memory item
    memory_item = memory_manager.get_memory_item(idx)
    memory_manager.display_conversation()
