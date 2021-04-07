# Backend Unit Testing
---
## Tools needed
```
unittest
coverage
unittest.mock.patch
```
Remeber to run `pipenv install --deploy` to install the above

## Tutorials
- [Flask-Testing module sample tests](https://pythonhosted.org/Flask-Testing/)
- [3 ways to use the unittest.mock.patch object](https://www.youtube.com/watch?v=WFRljVPHrkE)
- [Info about the coverage measurement tool](https://coverage.readthedocs.io/en/coverage-5.5/), FYI only

## Contributing to the unittest
- Create a python file with any name as long as it **starts** with `test_`. I.e. `test_auditsEndpoint.py`, `test_imagesEndpoint.py`
- In your file, extend the `BTSAppTestCase` class from `BTSApp.py`
- To control mongo's behaviour, access it thru `self.mongo`
- Create your test cases, you can import json files to use as test requests to the specific endpoints or create them on the fly, example below.


```python
class TestAuditsEndpt(BTSAppTestCase):

    def test_example(self):
        response = self.client.get("/")
        self.assertEqual(
            response.json, 
            dict(
                data=None, 
                description="Yes this endpoint is working."
                )
            )
        self.assertEqual(response.status_code, 200)
    
    def test_mongo(self):
        self.mongo.db.audits.find_one.return_value = 123
        assert self.mongo.db.audits.find_one() == 123

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

        imageData = js["images"][0]["uri"]
        imageData = imageData.partition(",")[2]
        imageData = imageData.encode('utf-8')
        pad = len(imageData) % 4
        imageData += b"="*pad
        imageBytes = io.BytesIO(b64decode(imageData))

        upload_func.assert_called_with(imageBytes, os.getenv("S3_BUCKET"), "toilet.jpg")
```

## Executing unittests and report on results
### Activate virtual environment
```
pipenv shell
```
### Run the unittest file
Run the following line in a command prompt opened the directory that thsis README.md file is located.
This command must be run before any of the following 2 commands can be run meaningfully.
```
coverage run -m --branch unittest discover
```

### Generate the report in the command line 
```
coverage report .\test_*.py .\BTSApp.py ..\BTS\*.py
```
#### Reading the outputs
Below is a typical output from running `coverage report .\test_*.py .\BTSApp.py ..\BTS\*.py`
```
Name                                    Stmts   Miss Branch BrPart  Cover
-------------------------------------------------------------------------
..\BTS\auditEmailEndpoint.py               77     70     28      0     7%
..\BTS\auditsEndpoint.py                  336    270    152      8    16%
..\BTS\auditsEndpoint_wx.py                31     21      8      0    26%
..\BTS\constants.py                         4      0      0      0   100%
..\BTS\database.py                          2      0      0      0   100%
..\BTS\imagesEndpoint.py                   72     34     24      2    50%
..\BTS\institutionEndpoint.py              15      9      4      0    32%
..\BTS\login.py                             6      2      0      0    67%
..\BTS\loginEndpoints.py                   86     64     30      0    19%
..\BTS\recentAuditsEndpoints.py            52     41     22      0    15%
..\BTS\staff_tenantEndpoint_wx.py          57     43     22      0    18%
..\BTS\test_endpoint_mongodb_atlas.py      43     43     10      0     0%
..\BTS\utils.py                           158    127     36      0    16%
.\BTSApp.py                                39      0      2      0   100%
.\test_sample.py                           67      2      6      1    96%
-------------------------------------------------------------------------
TOTAL                                    1045    726    344     11    25%
```

### Generate HTML reports on coverage
```
coverage html .\test_*.py .\BTSApp.py ..\BTS\*.py
```
#### Reading the outputs
There will be a folder called `/htmlcov` and a file called `index.html` which contains the summary of the coverage report. To see in detail which lines were run and which lines weren't, check out any file named `*_py.html`