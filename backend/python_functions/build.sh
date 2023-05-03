#!/bin/sh

# Set your variables
PROJECT_ID=$PROJECT_ID
REGION="us-east1"

# Load secrets
DEEPLAKE_ACCOUNT_NAME=$(gcloud secrets versions access latest --secret="deeplake-account-name" --project="$PROJECT_ID")
DEEPLAKE_TOKEN=$(gcloud secrets versions access latest --secret="deeplake-token" --project="$PROJECT_ID")
OPENAI_API_KEY=$(gcloud secrets versions access latest --secret="openai-api-key" --project="$PROJECT_ID")
ELASTICSEARCH_PASSWORD=$(gcloud secrets versions access latest --secret="elastic-pw" --project="$PROJECT_ID")

# Create a temporary app.yaml file with environment variables
cat > app_temp.yaml << EOL
runtime: python39
service: llm-backend
entrypoint: gunicorn -w 1 -k uvicorn.workers.UvicornWorker main:app
instance_class: F1
env_variables:
  DEEPLAKE_ACCOUNT_NAME: "$DEEPLAKE_ACCOUNT_NAME"
  DEEPLAKE_TOKEN: "$DEEPLAKE_TOKEN"
  OPENAI_API_KEY: "$OPENAI_API_KEY"
  ELASTICSEARCH_PASSWORD: "$ELASTICSEARCH_PASSWORD"
EOL

# Deploy to App Engine
gcloud app deploy app_temp.yaml --project="$PROJECT_ID" --quiet

# Remove the temporary app.yaml file
rm app_temp.yaml
