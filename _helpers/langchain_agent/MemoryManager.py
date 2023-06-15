import openai
import json
import time
import psycopg2
from uuid import uuid4


class MemoryManager:
    def __init__(self, model, max_tokens=2048):
        self.model = model
        self.max_tokens = max_tokens
        self.messages = [{"role": "system", "content": "You are a helpful AI assistant."}]
        self.id = str(uuid4())
        # Connect to the PostgreSQL database
        self.conn = psycopg2.connect(
            host="localhost",
            database="your_database_name",
            user="your_user",
            password="your_password"
        )

        # Create a cursor object
        self.cur = self.conn.cursor()

        # Create the table if it doesn't exist
        self.cur.execute(f'''CREATE TABLE IF NOT EXISTS {self.id} (
            interaction_index BIGINT PRIMARY KEY,
            memory_item JSONB NOT NULL
        )''')
        self.conn.commit()

    def add_message(self, role, content):
        timestamp = int(time.time() * 1000)  # Current timestamp in milliseconds
        self.messages.append({"role": role, "content": content, "interaction_index": timestamp})
        self.truncate_history()
        
    def truncate_history(self):
        total_tokens = sum(len(item["content"]) for item in self.messages)
        while total_tokens > self.max_tokens:
            removed_item = self.messages.pop(0)
            total_tokens -= len(removed_item["content"])
            self.archive_memory_item(removed_item)

    def archive_memory_item(self, memory_item):
        # Save the memory item in Redis only if 'interaction_index' key is present
        if "interaction_index" in memory_item:
            interaction_index = memory_item["interaction_index"]
            self.cur.execute(f"INSERT INTO memory (interaction_index, memory_item) VALUES ({interaction_index}, {json.dumps(memory_item)})")
        else:
            print("Warning: Tried to archive memory item without interaction_index")
            
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
        # Retrieve memory item by interaction index from Redis
        memory_item = self.redis.get(f"memory_item:{interaction_index}")
        return json.loads(memory_item) if memory_item else None
    
if __name__ == "__main__":
    # Example usage:
    memory_manager = MemoryManager(model='gpt-3.5-turbo-0613')

    # Add messages with interaction indices
    # memory_manager.add_message("user", "What's the weather like in Boston?", interaction_index=1)
    # memory_manager.add_message("assistant", "The weather in Boston is sunny.", interaction_index=2)
    # memory_manager.add_message("user", "Tell me a joke.", interaction_index=3)
    # Archive a memory item manually
    memory_manager.archive_memory_item({"role": "user", "content": "This is a test message.", "interaction_index": 4})

    # Retrieve the manually archived memory item
    memory_item = memory_manager.get_memory_item(4)
    print(json.dumps(memory_item, indent=2))
