from BTS.auditsEndpoint import addAuditsEndpoint
from BTS.loginEndpoints import addLoginEndpointsForTenantAndStaff
from BTS.imagesEndpoint import addImagesEndpoint
from BTS.auditsEndpoint_wx import addWenXinEndpoints
from BTS.constants import MONGODB_URI
from BTS.utils import successMsg, successResponse
from flask import Flask, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import secrets


app = Flask(__name__)
app.config["MONGO_URI"] = MONGODB_URI
app.config["SECRET_KEY"] = secrets.token_urlsafe(nbytes=32)
mongo = PyMongo(app)
CORS(app, supports_credentials=True)


@ app.route('/', methods = ["GET", "POST"])
def hello_world():
    return successResponse(successMsg("Yes this endpoint is working"))


addWenXinEndpoints(app, mongo)
addAuditsEndpoint(app, mongo)
addImagesEndpoint(app)
addLoginEndpointsForTenantAndStaff(app, mongo)


# @app.after_request
# def after_request_func(response):
#     response.headers["Access-Control-Allow-Origin"] = "http://localhost:19006"
#     response.headers["Access-Control-Allow-Credentials"] = true
#     print("after_request is running!", response)
#     return response


app.run(debug=True)
