#!/bin/sh

# Set your variables
PROJECT_ID=$PROJECT_ID
IMAGE_NAME="llm_backend"
SERVICE_NAME="llm-backend"
REGION="us-east1"

echo $DEEPLAKE_ACCOUNT_NAME
echo $DEEPLAKE_TOKEN

# Build the Docker image
docker build -t "$IMAGE_NAME" . \
  --build-arg DEEPLAKE_ACCOUNT_NAME=$DEEPLAKE_ACCOUNT_NAME \
  --build-arg DEEPLAKE_TOKEN=$DEEPLAKE_TOKEN \
  --build-arg OPENAI_API_KEY=$OPENAI_API_KEY

# Tag the Docker image for Google Container Registry (GCR)
docker tag "$IMAGE_NAME" "gcr.io/$PROJECT_ID/$IMAGE_NAME"

# Push the Docker image to GCR
docker push "gcr.io/$PROJECT_ID/$IMAGE_NAME"

# Deploy to Cloud Run
gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/$PROJECT_ID/$IMAGE_NAME" \
  --platform managed \
  --region "$REGION" \
  --min-instances "1" \
  --memory 1Gi \
  --allow-unauthenticated