import firebase_admin
import json
import uuid
import logging
from firebase_admin import credentials, firestore


def upload_to_firestore(data, collection_name):
    # Use a service account
    cred = credentials.Certificate('../../../Documents/cfa-creds.json')
    firebase_admin.initialize_app(cred)

    db = firestore.client()
    for item in data:
        id = str(uuid.uuid4())
        item['parsed_question']['id'] = id
        # Create a new document in collection with the ID as the document name
        doc_ref = db.collection(collection_name).document(id)
        try:
            doc_ref.set(item)  # Set the data of the document to your JSON
        except Exception as e:
            print(item.get('parsed_question'))


if __name__ == "__main__":
    # Read JSON file
    with open('questions_data.json', 'r') as f:
        data = json.load(f)
    upload_to_firestore(data, 'questions')
