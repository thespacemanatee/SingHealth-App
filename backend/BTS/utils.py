import os
import json
from flask import make_response, jsonify
from bson import json_util
from exponent_server_sdk import (
    DeviceNotRegisteredError,
    PushClient,
    PushMessage,
    # PushResponseError,
    PushServerError,
    PushTicketError
) 

from requests.exceptions import ConnectionError, HTTPError


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

def send_push_message(token, message, extra=None):
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        body=message,
                        data=extra))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'errors': exc.errors,
                'response_data': exc.response_data,
            })
        raise
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        rollbar.report_exc_info(
            extra_data={'token': token, 'message': message, 'extra': extra})
        raise self.retry(exc=exc)

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # Mark the push token as inactive
        from notifications.models import PushToken
        PushToken.objects.filter(token=token).update(active=False)
    except PushTicketError as exc:
        # Encountered some other per-notification error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'push_response': exc.push_response._asdict(),
            })
        raise self.retry(exc=exc)

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
    
def check_duplicate(mongo, collection, key, value):
    results = mongo.db[collection].find({key: value}).count()
    if(results != 0):
        return True
    else:
        return False


if __name__ == "__main__":
    token = "ExponentPushToken[61HwA2IufZFetOn8QjgycH]"
    send_push_message(token, "HERRROROROFOW")