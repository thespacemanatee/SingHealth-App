import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase
import BTS.imagesEndpoint
import mongomock
import unittest
from tempfile import NamedTemporaryFile
from unittest.mock import patch
from botocore.exceptions import ClientError

@patch.object(BTS.imagesEndpoint, "upload_image", return_value = None)
@patch.object(BTS.imagesEndpoint, "download_image", return_value = None)
class TestPostImagesEndpt(BTSAppTestCase):
    
    def test_valid_post_json(self, download_func, upload_func):
        js = {
            "images": [
                {
                    "fileName": "toilet.jpg",
                    "uri": "d:/toilet.jpg"
                }
            ]
        }
        response = self.client.post("/images", json=js)
        self.assertEqual(response.status_code, 200)
        upload_func.assert_called()

    def test_no_images(self, download_func, upload_func):
        js = dict()
        response = self.client.post("/images", json=js)
        self.assertEqual(response.status_code, 400)

    def test_valid_post_formdata(self, download_func, upload_func):
        multipleFiles = [
            ("images",("speedo.png", NamedTemporaryFile(),"image/jpg"))
        ]
        response = self.client.post("/images", files = multipleFiles)
        self.assertEqual(response.status_code, 200)
        upload_func.assert_called()
    
    def test_post_formdata_duplicate_images(self, download_func, upload_func):
        multipleFiles = {"images":[
            ("speedo.png", NamedTemporaryFile(),"image/jpg"),
            ("speedo.png", NamedTemporaryFile(),"image/jpg")
            ]
            }
        response = self.client.post("/images", data = multipleFiles, content_type="multipart/formdata")
        self.assertEqual(response.status_code, 400)
        assert not upload_func.called

    def test_invalid_fileNames(self, download_func, upload_func):
        js = {
            "images": [
                {
                    "fileName": "toilet.xlsx",
                    "uri": "d:/toilet.docx"
                }
            ]
        }
        response = self.client.post("/images", json=js)
        self.assertEqual(response.status_code, 400)
        assert not upload_func.called
        assert not download_func.called

    def test_invalid_json_image_key(self, download_func, upload_func):
        invalidJsonKey = "ims"
        js = {
            invalidJsonKey : [
                {
                    "fileName": "qwe.jpg",
                    "uri": "123"
                },
                {
                    "fileName": "qwe.jpg",
                    "uri": "123"
                }
            ]
        }
        response = self.client.post("/images", json=js)
        self.assertEqual(response.status_code,400)

    def test_invalid_filename_uri_key(self, download_func, upload_func):
        invalidFileKey1 = "fileame"
        invalidFileKey2 = "fileNae"
        invalidUriKey1 = "ri"
        invalidUriKey2 = "ur"
        js = {
            "images": [
                {
                    invalidFileKey1: "1.jpg",
                    invalidUriKey1: "1"
                },
                {
                    invalidFileKey2: "2.jpg",
                    invalidUriKey2: "2"
                }
            ]
        }
        response = self.client.post("/images", json=js)
        self.assertEqual(response.status_code, 400)

    def test_post_json_duplicate_images(self, download_func, upload_func):
        js = {
            "images": [
                {
                    "fileName": "qwe.jpg",
                    "uri": "123"
                },
                {
                    "fileName": "qwe.jpg",
                    "uri": "123"
                }
            ]
        }
        response = self.client.post("/images", json=js)
        self.assertEqual(response.status_code, 400)


@patch.object(BTS.imagesEndpoint, "download_image", return_value = None)
class TestGetImagesEndpt(BTSAppTestCase):
    def test_image_not_found(self, download_func):
        download_func.side_effect = ClientError({}, "Error response")
        response = self.client.get("/images?fileName=blablabla.jpg")
        self.assertEqual(response.status_code, 404)
        download_func.assert_called()

    # @patch.object(BTS.imagesEndpoint, "b64encode", return_value = None)
    # def test_valid_request(self, b64_func, download_func):
    #     download_func.return_value = None
    #     download_func.side_effect = None
    #     response = self.client.get("/images?fileName=blablabla.jpg")
    #     self.assertEqual(response.status_code, 200)
    #     download_func.assert_called()
    #     b64_func.assert_called()    

    def test_random_error(self, download_func):
        download_func.side_effect = Exception("Random exception")
        response = self.client.get("/images?fileName=blablabla.jpg")
        self.assertEqual(response.status_code, 500)
        download_func.assert_called()

    
    # def test_valid_request(self, download_func):

    #     pass
    

if __name__ == '__main__':
    unittest.main()