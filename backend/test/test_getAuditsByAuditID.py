from BTSApp import BTSAppTestCase
import unittest
import json

class TestGetAuditsByID(BTSAppTestCase):
    def setUp(self):
        with open(
            "test requests\\get_audits_by_id\\filledAuditFormNon_fnb.json",
            "r"
            ) as filledAuditFormNon_fnb, \
            open(
            "test requests\\get_audits_by_id\\filledAuditFormCovid19.json",
            "r"
            ) as filledAuditFormCovid19:
            non_fnb = json.load(filledAuditFormNon_fnb)
            covid19 = json.load(filledAuditFormCovid19)
        
        def mongoSideEffect(inputDict):
            if inputDict["_id"] == "2021-04-04T18:42:31.460Z6065de0ec8b7adbe23debd90non_fnb":
                return non_fnb
            elif inputDict["_id"] == "2021-04-04T18:42:31.460Z6065de0ec8b7adbe23debd90covid19":
                return covid19
        
        self.mongo.db.filledAuditForms.find_one.side_effect = mongoSideEffect

        with open(
            "test requests\\get_audits_by_id\\audit.json",
            "r"
            ) as audit:
            self.mongo.db.audits.find_one.return_value = json.load(audit)

        
        
    def test_valid_request(self):
        with open(
            "test requests\\get_audits_by_id\\endpointResponse.json"
            ) as endpointResponse:
            
            response = self.client.get("/audits/x68765yt34kmujnyhbtgR606969818e6e53b0f4e6ab4fSKH2021-04-04T18:42:31.460Z")
            self.assertEqual(response.status_code, 200)
    def test_form_not_found(self):
        self.mongo.db.filledAuditForms.find_one.return_value = None
        self.mongo.db.filledAuditForms.find_one.side_effect = None
        response = self.client.get("/audits/x68765yt34kmujnyhbtgR606969818e6e53b0f4e6ab4fSKH2021-04-04T18:42:31.460Z")
        self.assertEqual(response.status_code, 404)
        
    def test_audit_not_found(self):
        self.mongo.db.audits.find_one.return_value = None
        response = self.client.get("/audits/x68765yt34kmujnyhbtgR606969818e6e53b0f4e6ab4fSKH2021-04-04T18:42:31.460Z")
        self.assertEqual(response.status_code, 404)
    

if __name__ == '__main__':
    unittest.main()