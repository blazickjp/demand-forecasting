#!/bin/bash

# Set your variables here
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="cf-chat-app"
REGION="us-east1"
IMAGE_NAME="cfa-chat-app"
ENV_FILE=".env.prod"  # use .env.dev for development

# Read environment variables from the .env file
export $(grep -v '^#' $ENV_FILE | xargs)

# Build the Docker image
docker build -t gcr.io/$PROJECT_ID/$IMAGE_NAME .

# Push the Docker image to Google Container Registry
docker push gcr.io/$PROJECT_ID/$IMAGE_NAME

# Prepare environment variables for the --set-env-vars flag
ENV_VARS=$(printf ",%s=%s" $(grep -v '^#' $ENV_FILE | xargs))
ENV_VARS=${ENV_VARS:1}  # remove leading comma

# Deploy the image to Cloud Run
gcloud run deploy $SERVICE_NAME --image gcr.io/$PROJECT_ID/$IMAGE_NAME --region $REGION --platform managed --set-env-vars $ENV_VARS

# The script ends here
