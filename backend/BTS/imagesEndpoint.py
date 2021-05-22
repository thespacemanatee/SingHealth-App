from botocore.client import Config
from flask_login import login_required
from flask_pymongo import ObjectId
from flask import request
from .utils import serverResponse, upload_image, download_image
from .constants import IMAGE_FILETYPES, PRESIGNED_LINK_TIMEOUT, MAX_IMAGE_FILE_SIZE_PER_UPLOAD
from base64 import b64decode, b64encode
from botocore.exceptions import ClientError, ParamValidationError
import boto3
import io
import os
from dotenv import load_dotenv
from os.path import dirname, join
import os

load_dotenv(dirname(__file__), '.env')


def addImagesEndpoint(app):
    @app.route("/images", methods=["GET", 'POST'])
    @login_required
    def images():
        if request.method == 'POST':
            if (requestJson := request.get_json(silent=True)) != None:
                allImages = requestJson.get("images", [])
                if len(allImages) > 0:
                    imageFilenames = []
                    for image in allImages:
                        if (imageFilename := image.get("fileName", None)) != None:
                            if imageFilename.split(".")[-1] in IMAGE_FILETYPES:
                                imageFilenames.append(imageFilename)
                            else:
                                return serverResponse(
                                    None,
                                    400,
                                    f"Unknown image file extension used: {imageFilename.split('.')[-1]}"
                                )

                    detected_Duplicate_filenames = len(
                        imageFilenames) > len(set(imageFilenames))
                    if detected_Duplicate_filenames:
                        return serverResponse(None, 400, "Duplicate image names found")

                    for image in allImages:
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
            except ClientError:
                return serverResponse(None, 404, "Image not found")
            except:
                return serverResponse(None, 500, "Unexpected error, pls try again.")

    @app.route("/images/upload-url", methods=["GET"])
    @login_required
    def images_upload():
        if request.method == 'GET':
            fileName = str(ObjectId())
            bucketName = os.getenv("S3_BUCKET")
            session = boto3.session.Session()
            s3_client = session.client('s3')
            upload_link_metadata = s3_client.generate_presigned_post(
                bucketName,
                fileName,
                ExpiresIn=PRESIGNED_LINK_TIMEOUT,
                Conditions=[
                    [
                        "content-length-range",
                        0,
                        MAX_IMAGE_FILE_SIZE_PER_UPLOAD
                    ],
                ]
            )
            return serverResponse(
                upload_link_metadata,
                200,
                "Presigned upload URL successfully generated"
            )

    @app.route("/images/download-url", methods=["GET"])
    @login_required
    def images_download():
        if request.method == 'GET':
            args = request.args
            fileName = args.get("fileName", None)

            try:
                session = boto3.session.Session()
                s3_client = session.client('s3')
                download_link = s3_client.generate_presigned_url(
                    "get_object",
                    Params={
                        "Bucket": os.getenv("S3_BUCKET"),
                        "Key": fileName
                    },
                    ExpiresIn=PRESIGNED_LINK_TIMEOUT
                )
                status_code = 200
                msg = "Presigned download URL successfully generated"
            except ClientError:
                download_link = None
                status_code = 404
                msg = "The specified object does not exist"

            except ParamValidationError:
                msg = "Please provide a file name"
                download_link = None
                status_code = 400

            except:
                msg = "Please contact your administrator"
                download_link = None
                status_code = 500

            return serverResponse(
                download_link,
                status_code=status_code,
                msg=msg
            )
