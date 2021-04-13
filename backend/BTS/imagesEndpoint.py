from flask_login import login_required
from flask import request, make_response, jsonify
from .utils import serverResponse
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
    @login_required
    def images():
        if request.method == 'POST':
            if (requestJson := request.get_json(silent=True)) != None:
                allImages = requestJson.get("images", [])
                if len(allImages) > 0:
                    requestData = allImages

                    imageFilenames = []
                    for image in requestData:
                        if image.get("fileName", None) != None:
                            imageFilenames.append(image["fileName"])

                    detected_Duplicate_filenames = len(
                        imageFilenames) > len(set(imageFilenames))
                    if detected_Duplicate_filenames:
                        return serverResponse(None, 400, "Duplicate image names found")

                    for image in requestData:
                        try:
                            imageName = image["fileName"]
                            imageData = image["uri"]
                            imageData = imageData.partition(",")[2]
                            imageData = imageData.encode('utf-8')
                            pad = len(imageData) % 4
                            imageData += b"="*pad

                        except KeyError:
                            return serverResponse(
                                None, 400, "Wrong request format. Make sure every Image object has a 'fileName' & a 'uri' field")

                        imageBytes = io.BytesIO(b64decode(imageData))
                        upload_image(imageBytes, os.getenv(
                            "S3_BUCKET"), imageName)
                    return serverResponse(None, 200, "Pictures have successfully been uploaded")

            elif len(request.files) > 0:
                formdata = request.files
                images = formdata.getlist("images")

                detected_Duplicate_filenames = len(images) > len(set(images))
                if detected_Duplicate_filenames:
                    return serverResponse(None, 400, "Duplicate image names found")

                for image in images:
                    imgName = image.filename
                    upload_image(image, os.getenv("S3_BUCKET"), imgName)

                return serverResponse(None, 200, "Pictures have successfully been uploaded")
            return serverResponse(None, 400, "No image data received")

        elif request.method == "GET":
            filename = request.args.get("fileName", None)
            try:
                imageObject = download_image(
                    filename, os.getenv("S3_BUCKET"))
                imageBase64 = b64encode(
                    imageObject.getvalue()).decode()
                return serverResponse(imageBase64, 200, "Image found")
            except ClientError as e:
                return serverResponse(None, 404, "Image not found")
            except:
                return serverResponse(None, 500, "Unexpected error, pls try again.")
