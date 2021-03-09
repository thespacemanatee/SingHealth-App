import json

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