# -*- coding: utf-8 -*-

def return_response(desc, data = None, code = 200):
    internal_error = False
    
    #check data types:
    if isinstance(desc, str) and \
        isinstance(code, int):
            if data is None:
                output = {
                    "status": code,
                    "description": desc}
            else:
                if isinstance(data, list):
                    output = {
                        "status": code,
                        "description": desc,
                        "data": data}
                elif isinstance(data, dict):
                    output = {
                        "status": code,
                        "description": desc,
                        "data": [data]}
                else:
                    internal_error = True
    else:
        internal_error = True
    
    if internal_error:
         output = {
            "status": 404,
            "description": "Internal algorithm error."
            }
        
    return output

def check_required_info(mydict, key_arr):
    missing_keys = []
    key_value_error = []
    
    if isinstance(mydict, dict) and isinstance(key_arr , list):
        for item in key_arr:
            #check if the dictionary contains keys
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
        missing_keys , key_value_error = check_required_info(mydict, key_arr)
        if len(missing_keys) == 0 and len(key_value_error) == 0:
            return True, ""
        
        else:
            error_message = {}
            
            if len(missing_keys) > 0:
                error_message["missing_keys"] = missing_keys
                
            if len(key_value_error) > 0:
                error_message["key_value_error"] = key_value_error
                
        return False, error_message
    
    else:
        return False, "Wrong input parameter type"