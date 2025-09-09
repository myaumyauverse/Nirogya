#!/bin/bash

# Start backend API server and news ticker
cd backend
source ../venv/bin/activate
nohup python -c "import uvicorn; from api_server import app; uvicorn.run(app, host='0.0.0.0', port=8002)" &
nohup python api_server.py &
cd ..

# Start correlation API
cd data
source ../venv/bin/activate
nohup python correlation_api.py &
cd ..

cd frontend && npm run dev