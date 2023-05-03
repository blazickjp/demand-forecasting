## Service Account
```sh
gcloud iam service-accounts create app-backend
gcloud projects add-iam-policy-binding fresh-oath-383101 --member="serviceAccount:app-backend@fresh-oath-383101.iam.gserviceaccount.com" --role="roles/editor"
gcloud iam service-accounts keys create app-backend.json --iam-account=app-backend@fresh-oath-383101.iam.gserviceaccount.com
```

## Testing the backend
```sh
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"question": "what is cost accounting?", "user_id": "pnyHo4fvhphRHgCc34l4xIgfCig2", "dataset": "kaplan_cfa_level_2_book_1"}' \
     http://localhost:8888/llm_answer
```

## Elastic Key
```sh
cd demand-forecasting
gsutil cp gs://fresh-oath-383101-app-auth/* .
```