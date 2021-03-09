from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import setUpLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.constants import MONGODB_URI
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import secrets


app = Flask(__name__)
app.config["MONGO_URI"] = MONGODB_URI
app.config["SECRET_KEY"] = secrets.token_urlsafe(nbytes=32)
mongo = PyMongo(app)
CORS(app)


@app.route('/')
def hello_world():
    return 'Hello, good World!'


addAuditsEndpoint(app, mongo)
addImagesEndpoint(app)
setUpLoginEndpointsForTenantAndStaff(app, mongo)

app.run(debug=True)
