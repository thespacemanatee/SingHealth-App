import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase
import unittest
import json
from unittest.mock import patch


class TestPostAuditsEndpt(BTSAppTestCase):

    def test_example(self):
        response = self.client.get("/")
        # expected_response = {"data":}
        self.assertEqual(
            response.json, 
            dict(
                data=None, 
                description="Yes this endpoint is working."
                )
            )
        self.assertEqual(response.status_code, 200)

    def test_postaudits(self):
        js = {
            "auditMetadata": {
                "_id": "gte", 
                "staffID": "ertg", 
                "tenantID": "ge", 
                "institutionID":"CGH",
                "date": "grth", 
                "score" : 0.99, 
                "auditChecklists":{
                    "fnb":"gtsw",
                    "covid19": "bhte"
                }
            },
            "auditForms": {
                "fnb": {
                    "_id": "fnb2021",
                    "type": "fnb",
                    "questions": {
                        "hygiene": [
                            {
                                "answer":True
                            }
                        ],
                        "professionalism": [
                            {
                                "answer":True
                            }
                        ]
                    }
                },
                "covid19": {
                    "_id": "fnb2021",
                    "type": "fnb",
                    "questions": {
                        "cleanliness": [
                            {
                                "answer":True
                            }
                        ],
                        "safety": [
                            {
                                "answer":True
                            }
                        ]
                    }
                }
            }
        } 
        
        response = self.client.post("/audits",json=js)
        self.assertEqual(response.status_code, 400)

    def test_valid_request(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\filledAuditForm.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = True
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = True

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 200)
        self.mongo.db.audits.insert_one.assert_called()

    def test_no_ans_field(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\noAnsField.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_too_many_images(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\tooManyImages.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_duplicate_images(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\duplicateImages.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_false_but_no_remarks(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\falseButNoRemarks.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_false_but_no_deadline(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\falseButNoDeadline.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_non_iso_date_filledAuditForms(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\noISODateFilledAuditForms.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_conflicting_form_types(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditFormFNB = json.load(open("test requests\\post_audits\\filledAuditFormsFNB.json","r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\noISODateFilledAuditForms.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm,
                "fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_unknown_form_types(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\filledAuditForm.json","r"))
        filledAuditForm_unknownFormType = json.load(open("test requests\\post_audits\\filledAuditForm_unknownFormType.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm,
                "123": filledAuditForm_unknownFormType
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_non_iso_date_auditmetadata(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata_nonISODate.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\filledAuditForm.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_database_no_ack_auditMetadata(self):
        auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
        filledAuditForm = json.load(open("test requests\\post_audits\\filledAuditForm.json","r"))
        test_request = {
            "auditMetadata":auditMetadata, 
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = True

        response = self.client.post("/audits",json=test_request)
        self.assertEqual(response.status_code, 503)
        self.mongo.db.audits.insert_one.called
        self.mongo.db.filledAuditForms.insert_one.called

    def test_database_no_ack_filledAuditForms(self):
            auditMetadata = json.load(open("test requests\\post_audits\\auditMetadata.json", "r"))
            filledAuditForm = json.load(open("test requests\\post_audits\\filledAuditForm.json","r"))
            test_request = {
                "auditMetadata":auditMetadata, 
                "auditForms": {
                    "non_fnb": filledAuditForm
                }
            }
            self.mongo.db.audits.insert_one.return_value.acknowledged = True
            self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

            response = self.client.post("/audits",json=test_request)
            self.assertEqual(response.status_code, 503)
            self.mongo.db.audits.insert_one.called
            self.mongo.db.filledAuditForms.insert_one.called
    



if __name__ == "__main__":
    unittest.main()