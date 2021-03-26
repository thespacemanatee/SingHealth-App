import json
from flask import make_response, jsonify
import os


def printJ(data):
    print(json.dumps(data, indent=4, sort_keys=False))

def serverResponse(data, status_code, msg):
    r = make_response(jsonify(data))
    r.status = msg
    r.status_code = status_code
    return r
