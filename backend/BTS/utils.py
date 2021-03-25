import json
from flask import make_response, jsonify
import os


def printJ(data):
    print(json.dumps(data, indent=4, sort_keys=False))


def successMsg(msg):
    output = dict()
    output["status"] = 200
    output["description"] = msg
    return output


def failureMsg(msg, code):
    output = dict()
    output["status"] = code
    output["description"] = msg
    return output


def successResponse(jsonMsg):
    response = make_response(jsonify(jsonMsg), 200)
    # response.headers.add('Access-Control-Allow-Headers',
    #                      "Origin, X-Requested-With, Content-Type, Accept, x-auth")
    # response.headers["Access-Control-Allow-Origin"] = os.getenv('WEB_APP_URI')
    # response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


def failureResponse(jsonMsg, code):
    response = make_response(jsonify(jsonMsg), code)
    # response.headers.add('Access-Control-Allow-Headers',
    #                      "Origin, X-Requested-With, Content-Type, Accept, x-auth")
    # response.headers["Access-Control-Allow-Origin"] = os.getenv('WEB_APP_URI')
    # response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
