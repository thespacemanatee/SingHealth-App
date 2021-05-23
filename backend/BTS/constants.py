MAX_NUM_IMAGES_PER_NC = 20

PRESIGNED_LINK_TIMEOUT = 300# seconds
MAX_IMAGE_FILE_SIZE_PER_UPLOAD = 100_000_000# Bytes

BTS_EMAIL = "mailservice.bts@gmail.com"

BTS_APP_CONFIG_EMAIL = dict(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USE_SSL=False,
        MAIL_USERNAME=BTS_EMAIL,
        MAIL_PASSWORD='BTS_admin_1',
        )
CORS_LOCALHOST = "http://localhost:19006"
SGT_TIMEZONE = "Asia/Singapore"


IMAGE_FILETYPES = [
        'rgb',
        'gif',
        'pbm',
        'pgm',
        'ppm',
        'tiff',
        'rast',
        'xbm',
        'jpeg',
        'jpg',
        'bmp',
        'png',
        'webp',
        'exr'
        ]
