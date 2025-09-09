#!/bin/sh

# Install python and deps
pyenv install 3.10.13
pyenv local 3.10.13
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd frontend && npm i
