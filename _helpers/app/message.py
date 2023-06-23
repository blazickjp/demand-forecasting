from datetime import datetime


class Message:
    def __init__(self, author, content):
        self.author = author
        self.content = content
        self.timestamp = datetime.now()

    def render(self):
        time = self.timestamp.strftime("%H:%M:%S")
        return f"[{time}] {self.author}: {self.content}"
