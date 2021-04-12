import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase
import unittest
import json

class TestGetFormEndpoint(BTSAppTestCase):
    
    def test_valid(self):
        self.mongo.db.auditFormTemplate.find_one.return_value = {"_id":"fnb2021","type":"fnb","questions":{}}       
        response = self.client.get("/auditForms?formType=fnb")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Success")
    
    def test_invalid_noParam(self):
        response = self.client.get("/auditForms")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Missing form type")
    
    def test_invalid_invalidParam(self):
        response = self.client.get("/auditForms?form_type=fnb")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Missing form type")
        
    def test_valid_getEmpty(self):
        self.mongo.db.auditFormTemplate.find_one.return_value = None
        response = self.client.get("/auditForms?formType=SUTD")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "No matching form")
    
    def test_invalid(self):
        self.mongo.db.auditFormTemplate.find_one.return_value = []
        response = self.client.get("/auditForms?formType=SUTD")
        self.assertEqual(response.status_code, 404)

class TestGetTenantEndpoint(BTSAppTestCase):
    def test_valid(self):
        self.mongo.db.tenant.find.return_value = [{"_id":"6065de0ec8b7adbe23debd90",
                                                    "name":"Zark Muckerberg",
                                                    "email":"whateverisgood577@gmail.com",
                                                    "pswd":"bts",
                                                    "institutionID":"SKH",
                                                    "stallName":"Continental Electronics",
                                                    "fnb":False,
                                                    "createdBy":"","dateCreated":"","expoToken":[]}]
        
        response = self.client.get("/tenants?institutionID=test")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Success")
        
    def test_invalid_noParam(self):
        response = self.client.get("/tenants")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Missing institutionID")
    
    def test_invalid_invalidParam(self):
        response = self.client.get("/tenants?testkey=testVal")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "Missing institutionID")
        
    def test_valid_getEmpty(self):
        self.mongo.db.tenant.find.return_value = []
        response = self.client.get("/tenants?institutionID=test")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response_dict["description"], "No tenant with the institution ID found")

    def test_invalid(self):
        self.mongo.db.tenant.find.return_value = None
        response = self.client.get("/tenants?institutionID=test")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 404)
    
if __name__ == '__main__':
    unittest.main()