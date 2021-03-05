import io
import boto3
from PIL import Image


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
    s3 = boto3.resource('s3')
    file_stream = io.BytesIO()
    s3.Bucket(bucket).download_fileobj(file_name, file_stream)

    return file_stream


def list_images(bucket):
    """
    Function to list files in a given S3 bucket
    """
    s3 = boto3.client('s3')
    contents = []
    # try:
    for item in s3.list_objects(Bucket=bucket)['Contents']:
        contents.append(item)
    # except Exception as e:
    #     pass

    return contents

def successMsg(msg):
    output = dict()
    output["status"] = 200
    output["description"] = msg
    return output

def failureMsg(msg, code):
    output = dict()
    output["status"] = code
    output["description"] = msg
    return output


if __name__ == "__main__":
    print("helllo world")
    with open("bullseye2.png", "rb") as f:
        upload_image(f, "singhealth", "bullseye2.png")
    print("done")