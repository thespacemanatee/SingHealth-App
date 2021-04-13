import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase
import unittest
import json
import mongomock

class TestInstitution(BTSAppTestCase):

    def test_valid_get(self):
        self.mongo.db.institution.find.return_value = [{"_id":"CGH","name":"Changi General Hospital","address":{"street":"Simei street 3","zipcode":"529889"},"poc":{"name":"Sam","email":"sam@skh.gov.sg"}}]
        
        response = self.client.get("/institutions")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict["description"], "Success")
        
    def test_valid_getEmpty(self):
        self.mongo.db.institution.find.return_value = []
        
        response = self.client.get("/institutions")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict["description"], "No institution found")
    
    def test_invalid(self):
        self.mongo.db.institution.find.return_value = None
        
        response = self.client.get("/institutions")
        self.assertEqual(response.status_code, 404)
    

if __name__ == '__main__':
    unittest.main()