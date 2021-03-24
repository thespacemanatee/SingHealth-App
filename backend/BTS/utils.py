import json
from flask import make_response, jsonify


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
    response.headers["Access-Control-Allow-Origin"] = "https://605afa1121137dd43cc96ac2--esc-group-10.netlify.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


def failureResponse(jsonMsg, code):
    response = make_response(jsonify(jsonMsg), code)
    response.headers["Access-Control-Allow-Origin"] = "https://605afa1121137dd43cc96ac2--esc-group-10.netlify.app"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
