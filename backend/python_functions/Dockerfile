# Use the official Python base image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

ARG DEEPLAKE_ACCOUNT_NAME
ARG DEEPLAKE_TOKEN
ARG OPENAI_API_KEY

ENV DEEPLAKE_ACCOUNT_NAME=${DEEPLAKE_ACCOUNT_NAME}
ENV DEEPLAKE_TOKEN=${DEEPLAKE_TOKEN}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Copy requirements.txt to the working directory
COPY requirements.txt .

# Install required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
