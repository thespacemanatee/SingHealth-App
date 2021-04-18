from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, userEmail):
        self.userEmail = userEmail

    def get_id(self):
        return self.userEmail
