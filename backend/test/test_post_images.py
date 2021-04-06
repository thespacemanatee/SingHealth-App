import sys
sys.path.append("..\\")
from BTSApp import BTSAppTestCase
import BTS.imagesEndpoint
import mongomock
import unittest
from unittest.mock import patch

@patch.object(BTS.imagesEndpoint, "upload_image", return_value = None)
@patch.object(BTS.imagesEndpoint, "download_image", return_value = None)
class TestImagesEndpt(BTSAppTestCase):
    
    def test_valid_post(self, download_func, upload_func):
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
        assert not upload_func.assert_called()
        assert not download_func.assert_called()


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
        self.assertEqual(response.status_code,400)
    

if __name__ == '__main__':
    unittest.main()