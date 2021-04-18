import os
from dotenv import load_dotenv
from os.path import dirname

load_dotenv(dirname(__file__), '.env')
    
FLASK_APP = os.getenv('FLASK_APP')
FLASK_ENV = "development"

SECRET_KEY = os.getenv('SECRET_KEY')
MONGO_URI = os.getenv("MONGODB_URI")