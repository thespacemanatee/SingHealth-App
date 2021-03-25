from flask_login import login_required
from flask import request
from .utils import successMsg, failureMsg, failureResponse, successResponse
from base64 import b64decode, b64encode
from botocore.exceptions import ClientError
import boto3
import io
import traceback
import os


def upload_image(file_obj, bucket, file_name):
    """
    Function to upload a file to an S3 bucket
    """
    s3_client = boto3.client('s3')
    response = s3_client.upload_fileobj(file_obj, bucket, file_name)
    return response


def download_image(file_name, bucket):
    """
    Function to download a given file from an S3 bucket
    """
    s3 = boto3.client('s3')
    file_stream = io.BytesIO()
    s3.download_fileobj(bucket, file_name, file_stream)

    return file_stream


def list_images(bucket):
    """
    Function to list files in a given S3 bucket
    """
    s3 = boto3.client('s3')
    contents = []
    for item in s3.list_objects(Bucket=bucket)['Contents']:
        contents.append(item)

    return contents


def addImagesEndpoint(app):
    @app.route("/images", methods=["GET", 'POST'])
    # @login_required
    def images():
        if request.method == 'POST':
            if (requestJson := request.get_json(silent=True)) != None:
                allImages = requestJson.get("images", [])
                if len(allImages) > 0:
                    requestData = allImages

                    imageFilenames = []
                    for image in requestData:
                        imageFilenames.append(image["fileName"])

                    detected_Duplicate_filenames = len(
                        imageFilenames) > len(set(imageFilenames))
                    if detected_Duplicate_filenames:
                        return failureResponse(failureMsg("Duplicate image names found", 400), 400)

                    for image in requestData:
                        try:
                            imageName = image["fileName"]
                            imageData = image["uri"]
                            imageData = imageData.partition(",")[2]
                            imageData = imageData.encode('utf-8')
                            pad = len(imageData) % 4
                            imageData += b"="*pad

                        except KeyError:
                            return failureResponse(failureMsg(
                                "Wrong request format. Make sure every Image object has a 'fileName' & a 'uri' field", 400), 400)

                        imageBytes = io.BytesIO(b64decode(imageData))
                        upload_image(imageBytes, os.getenv(
                            "S3_BUCKET"), imageName)
                    return successResponse(successMsg("Pictures have successfully been uploaded"))

            elif len(request.files) > 0:
                formdata = request.files
                images = formdata.getlist("images")

                detected_Duplicate_filenames = len(images) > len(set(images))
                if detected_Duplicate_filenames:
                    return failureResponse(failureMsg("Duplicate image names found", 400), 400)

                for image in images:
                    imgName = image.filename
                    upload_image(image, os.getenv("S3_BUCKET"), imgName)

                return successResponse(successMsg("Pictures have successfully been uploaded"))
            return failureResponse(failureMsg("No image data received", 400), 400)

        elif request.method == "GET":
            try:
                details = request.json
                filenames = details["fileNames"]
                output = []
                n = 0
                m = 0
                o = 0
                failed = []
                for index, filename in enumerate(filenames):
                    try:
                        # TODO: Might need to strip the header before sending it back to the client
                        imageObject = download_image(
                            filename, os.getenv("S3_BUCKET"))
                        imageBase64 = b64encode(
                            imageObject.getvalue()).decode()
                        output.append(imageBase64)
                        n += 1
                    except ClientError as e:
                        msg = str(e)
                        if "Not Found" in msg:
                            m += 1
                            failed.append(filename)
                    except:
                        o += 1

                serverResponse = successMsg(
                    f"{n} images successfully downloaded, {m} images failed to download and {o} failed due to other reasons")
                serverResponse["uri"] = output
                serverResponse["notFound"] = failed

                return successResponse(serverResponse)
            except Exception as e:
                traceback.print_exc()
                return failureResponse(failureMsg("LOL", 503), 503)
