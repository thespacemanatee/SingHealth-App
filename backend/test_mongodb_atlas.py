# -*- coding: utf-8 -*-
"""
Created on Thu Mar 18 23:41:52 2021

@author: angel
"""

from pymongo import MongoClient, errors

# use a try-except indentation to catch MongoClient() errors
try:
    # try to instantiate a client instance
    
    client = MongoClient("mongodb+srv://admin:admin@bts.vjyxq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    db = client.BTS


    # print the version of MongoDB server if connection successful
    print ("server version:", client.server_info()["version"])
except errors.ServerSelectionTimeoutError as err:
    # set the client instance to 'None' if exception
    client = None

    # catch pymongo.errors.ServerSelectionTimeoutError
    print ("pymongo ERROR:", err)

"""
database_names() AND collection_names ARE DEPRECATED
"""
if client != None:

    # the list_database_names() method returns a list of strings
    database_names = client.list_database_names()

    print ("database_names() TYPE:", type(database_names))
    print ("The client's list_database_names() method returned", len(database_names), "database names.")

    # iterate over the list of database names
    for db_num, db in enumerate(database_names):

        # print the database name
        print ("\nGetting collections for database:", db, "--", db_num)

        # use the list_collection_names() method to return collection names
        collection_names = client[db].list_collection_names()
        print ("list_collection_names() TYPE:", type(database_names))
        print ("The MongoDB database returned", len(collection_names), "collections.")

        # iterate over the list of collection names
        for col_num, col in enumerate(collection_names):
            print (col, "--", col_num)

else:
    print ("The domain and port parameters passed to client's host is invalid")