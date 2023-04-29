## Testing the backend
```sh
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"question": "what is cost accounting?", "user_id": "pnyHo4fvhphRHgCc34l4xIgfCig2", "dataset": "kaplan_cfa_level_2_book_1"}' \
     http://localhost:8888/llm_answer
```