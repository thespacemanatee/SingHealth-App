import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase
from BTS.utils import serverResponse, find_and_return_one, send_audit_email_excel, send_audit_email_word
import unittest
import json
import mongomock

class TestEmail(BTSAppTestCase):

    def test_excel_valid(self):
        self.mongo.db.institution.find.return_value = [{"_id":"CGH","name":"Changi General Hospital","address":{"street":"Simei street 3","zipcode":"529889"},"poc":{"name":"Sam","email":"sam@skh.gov.sg"}}]
        response = self.client.post("/email/excel/x68765yt34kmujnyhbtgR606ef34cebe85ee9c3b37b1aSKH2021-04-08T15:53:47.639Z")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict["description"], "Audit email sent")
    
    def test_excel_invalid(self):
        response = self.client.post("/email/excel/")
        self.assertEqual(response.status_code, 404)
    
    def test_word_valid(self):
        response = self.client.post("/email/word/x68765yt34kmujnyhbtgR606ef34cebe85ee9c3b37b1aSKH2021-04-08T15:53:47.639Z")
        response_dict = json.loads(response.data.decode('utf-8'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response_dict["description"], "Audit email sent")
        
    def test_word_invalid(self):
        response = self.client.post("/email/word/")
        self.assertEqual(response.status_code, 404)
        
    
    

if __name__ == '__main__':
    unittest.main()