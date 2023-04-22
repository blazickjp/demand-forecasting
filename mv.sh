#!/bin/bash

# Create new frontend and backend folders
mkdir frontend backend

# Move frontend files and folders to the frontend folder
mv app.yaml components firebaseClient.js hooks next.config.js package-lock.json package.json pages postcss.config.js public styles frontend/

# Create backend functions folder
mkdir -p backend/functions

# Move API files to the backend functions folder
mv frontend/pages/api backend/functions

# Move to the backend/functions folder and create package.json file
cd backend/functions
npm init -y

# Install necessary dependencies for backend
npm install

# Move back to the root folder
cd ../..

# Add a .gitignore file in the root folder if not present
touch .gitignore
echo "node_modules" >> .gitignore
echo "frontend/.next" >> .gitignore
echo "frontend/out" >> .gitignore
echo "backend/functions/node_modules" >> .gitignore

echo "Folder restructuring completed."
