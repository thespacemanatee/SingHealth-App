from unittest.mock import patch
import json
import unittest
from BTSApp import BTSAppTestCase
import sys
sys.path.append("..\\")


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
                "institutionID": "CGH",
                "date": "grth",
                "score": 0.99,
                "auditChecklists": {
                    "fnb": "gtsw",
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
                                "answer": True
                            }
                        ],
                        "professionalism": [
                            {
                                "answer": True
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
                                "answer": True
                            }
                        ],
                        "safety": [
                            {
                                "answer": True
                            }
                        ]
                    }
                }
            }
        }

        response = self.client.post("/audits", json=js)
        self.assertEqual(response.status_code, 400)

    def test_valid_request(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\filledAuditForm.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = True
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = True

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 200)
        self.mongo.db.audits.insert_one.assert_called()

    def test_no_ans_field(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\noAnsField.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_too_many_images(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\tooManyImages.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_duplicate_images(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\duplicateImages.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_false_but_no_remarks(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\falseButNoRemarks.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_false_but_no_deadline(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\falseButNoDeadline.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_non_iso_date_filledAuditForms(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\noISODateFilledAuditForms.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_conflicting_form_types(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\filledAuditForm.json", "r") as faf:
            filledAuditForm = json.load(faf)
        with open("test requests\\post_audits\\filledAuditFormsFNB.json", "r") as fnbfaf:
            filledAuditFormFNB = json.load(fnbfaf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm,
                "fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_unknown_form_types(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\filledAuditForm.json", "r") as faf:
            filledAuditForm = json.load(faf)
        with open("test requests\\post_audits\\filledAuditForm_unknownFormType.json", "r") as fnbfaf:
            filledAuditForm_unknownFormType = json.load(fnbfaf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm,
                "123": filledAuditForm_unknownFormType
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_non_iso_date_auditmetadata(self):
        with open("test requests\\post_audits\\auditMetadata_nonISODate.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\filledAuditForm.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 400)
        assert not self.mongo.db.audits.insert_one.called

    def test_database_no_ack_auditMetadata(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\filledAuditForm.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = False
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = True

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 503)
        self.mongo.db.audits.insert_one.called
        self.mongo.db.filledAuditForms.insert_one.called

    def test_database_no_ack_filledAuditForms(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as am:
            auditMetadata = json.load(am)
        with open("test requests\\post_audits\\filledAuditForm.json", "r") as faf:
            filledAuditForm = json.load(faf)
        test_request = {
            "auditMetadata": auditMetadata,
            "auditForms": {
                "non_fnb": filledAuditForm
            }
        }
        self.mongo.db.audits.insert_one.return_value.acknowledged = True
        self.mongo.db.filledAuditForms.insert_one.return_value.acknowledged = False

        response = self.client.post("/audits", json=test_request)
        self.assertEqual(response.status_code, 503)
        self.mongo.db.audits.insert_one.called
        self.mongo.db.filledAuditForms.insert_one.called


class TestGetAuditsEndpt(BTSAppTestCase):
    def setUp(self):
        with open("test requests\\post_audits\\auditMetadata.json", "r") as f1:
            auditMetadata = json.load(f1)
        with open("test requests\\get_audits\\auditMetadata2.json", "r") as f2:
            auditMetadata2 = json.load(f2)
        with open("test requests\\get_audits\\auditMetadata2.json", "r") as t:
            tenant = json.load(t)
        self.mongo.db.audits.find.return_value = [
            auditMetadata, auditMetadata2]
        self.mongo.db.tenant.find_one.return_value = tenant

    def test_valid_tenantID_get_all_audits(self):
        response = self.client.get(
            "/audits?tenantID=6065de0ec8b7adbe23debd90&daysBefore=0"
        )
        self.assertEqual(response.status_code, 200)

    # def test_invalid_tenantID(self):
    #     response = self.client.get(
    #         "/audits?tenantID=0&daysBefore=0"
    #         )
    #     self.assertEqual(response.status_code, 400)
    def test_no_tenantID(self):
        response = self.client.get(
            "/audits?daysBefore=0"
        )
        self.assertEqual(response.status_code, 400)

    def test_get_some_audits(self):
        self.mongo.db.tenant.find_one.return_value.__getitem__.side_effect = {
            "stallName": "Continental Electronics"}
        response = self.client.get(
            "/audits?tenantID=6065de0ec8b7adbe23debd90daysBefore=3"
        )
        self.assertEqual(response.status_code, 200)

    def test_invalid_date_range(self):
        daysBefore = -3
        response = self.client.get(
            f"/audits?tenantID=6065de0ec8b7adbe23debd90daysBefore={daysBefore}"
        )
        self.assertEqual(response.status_code, 400)

    def test_valid_no_matching_audits(self):
        self.mongo.db.audits.find.return_value = None
        self.mongo.db.tenant.find_one.return_value = None
        response = self.client.get(
            f"/audits?tenantID=6065de0ec8b7adbe23debd90daysBefore=0"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["data"]
                         ["description"], "No audits found")


if __name__ == "__main__":
    unittest.main()
