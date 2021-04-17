MAX_NUM_IMAGES_PER_NC = 20

BTS_EMAIL = "Build.Tech.for.SingHealth@gmail.com"

BTS_APP_CONFIG_EMAIL = dict(
        DEBUG=True,
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USE_SSL=False,
        MAIL_USERNAME=BTS_EMAIL,
        MAIL_PASSWORD='BTS_admin_1',
        )
CORS_LOCALHOST = "http://localhost:19006"
SGT_TIMEZONE = "Asia/Singapore"


IMAGE_FILETYPES = ['rgb',
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
'exr']
