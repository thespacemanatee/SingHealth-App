import json
from flask import make_response, jsonify
from bson import json_util
import os


def parse_json(data):
    return json.loads(json_util.dumps(data))


def printJ(data):
    print(json.dumps(data, indent=4, sort_keys=False))


def serverResponse(data, status_code, msg):
    packet = {
        "data": data, 
        "description": msg
        }
    r = make_response(jsonify(parse_json(packet)))
    r.status_code = status_code
    return r


def check_required_info(mydict, key_arr):
    missing_keys = []
    key_value_error = []

    if isinstance(mydict, dict) and isinstance(key_arr, list):
        for item in key_arr:
            # check if the dictionary contains keys
            if item not in mydict:
                missing_keys.append(item)

            else:
                if mydict[item] is None:
                    key_value_error.append(item)
                elif isinstance(mydict[item], str):
                    if len(mydict[item]) == 0:
                        key_value_error.append(item)

        return missing_keys, key_value_error
    else:
        return None


def validate_required_info(mydict, key_arr):
    if check_required_info(mydict, key_arr) is not None:
        missing_keys, key_value_error = check_required_info(mydict, key_arr)
        if len(missing_keys) == 0 and len(key_value_error) == 0:
            return True, ""

        else:
            error_message = {}

            if len(missing_keys) > 0:
                error_message["missing_keys"] = missing_keys

            if len(key_value_error) > 0:
                error_message["key_value_error"] = key_value_error

        return False, [error_message]
