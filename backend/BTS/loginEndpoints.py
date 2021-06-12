from flask import request, session
from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash
from .login import User
from .utils import serverResponse


def addLoginEndpointsForTenantAndStaff(app, mongo, login_manager):
    @app.route('/login/staff',  methods=["POST"])
    def login_for_staff():
        if request.method == "POST":
            print("REcieved post login request")
            credentials = request.json
            expoToken = credentials.get("expoToken", None)
            userEmail = credentials["user"].lower()
            print("Forwarding to mongo")
            user = mongo.db.staff.find_one({"email": userEmail})
            print("Response from mongo")
            if user:
                dbUserEmail = user['email'].lower()
                if check_password_hash(user["pswd"], credentials["pswd"]):
                    user_obj = User(userEmail=dbUserEmail)
                    login_user(user_obj, remember=True)
                    session['account_type'] = "staff"

                    # Append the token to the DB
                    if expoToken is not None and expoToken != "" and \
                            expoToken not in user.get("expoToken", []):
                        mongo.db.staff.update_one(
                            {"email": userEmail},
                            [
                                {
                                    "$set": {
                                        "expoToken": {
                                            "$concatArrays": [
                                                "$expoToken",
                                                [expoToken]
                                            ]
                                        }
                                    }
                                }
                            ]
                        )

                    user.pop("pswd", None)
                    user.pop("expoToken", None)
                    return serverResponse(
                        user,
                        200,
                        f"You are now logged in as a staff under: {dbUserEmail}"
                    )
                else:
                    return serverResponse(
                        None,
                        404,
                        "Wrong password! Please try again."
                    )

            else:
                return serverResponse(
                    None,
                    404,
                    f"{userEmail} account does not exist"
                )

    @app.route('/login/tenant',  methods=["POST"])
    def login_for_tenant():
        if request.method == "POST":
            credentials = request.json
            expoToken = credentials.get("expoToken", None)
            userEmail = credentials["user"].lower()

            user = mongo.db.tenant.find_one(
                {"email": userEmail},
                {
                    "tenantDateEnd": 0,
                    "tenantDateStart": 0,
                    "dateCreated": 0,
                    "createdBy": 0
                }
            )
            if user:
                dbUserEmail = user['email'].lower()
                if check_password_hash(user["pswd"], credentials["pswd"]):
                    user_obj = User(userEmail=dbUserEmail)
                    login_user(user_obj, remember=True)
                    session['account_type'] = "tenant"

                    # Append the token to the DB
                    if expoToken is not None and expoToken != "" and  \
                            expoToken not in user.get("expoToken", []):
                        mongo.db.tenant.update_one(
                            {"email": userEmail},
                            [
                                {
                                    "$set": {
                                        "expoToken": {
                                            "$concatArrays": [
                                                "$expoToken",
                                                [expoToken]
                                            ]
                                        }
                                    }
                                }
                            ]
                        )

                    user.pop("pswd", None)
                    user.pop("expoToken", None)
                    return serverResponse(
                        user,
                        200,
                        f"You are now logged in as a tenant under: {dbUserEmail}"
                    )
                else:
                    return serverResponse(
                        None,
                        400,
                        "Wrong password! Please try again."
                    )

            else:
                return serverResponse(
                    None,
                    404,
                    f"{userEmail} account does not exist"
                )

    @app.route('/logout', methods=["POST"])
    @login_required
    def logout():
        if request.method == "POST":
            data = request.json
            if data == None:
                logout_user()
                return serverResponse(
                    None,
                    200,
                    "You are now logged out"
                )

            try:

                # TODO：Remove the token from the DB
                userEmail = current_user.get_id()
                userExpoToken = data["expoToken"]
                if session["account_type"] == "tenant":
                    mongo.db.tenant.update_one(
                        {"email": userEmail},
                        {
                            "$pull": {
                                "expoToken": {
                                    "$in": [userExpoToken]
                                }
                            }

                        }
                    )
                elif session["account_type"] == "staff":
                    mongo.db.staff.update_one(
                        {"email": userEmail},
                        {
                            "$pull": {
                                "expoToken": {
                                    "$in": [userExpoToken]
                                }
                            }

                        }
                    )
                session.pop('account_type')

            except KeyError:
                # print("Session lost. Forcefully logging out the user")
                pass

            finally:
                logout_user()
                return serverResponse(
                    None,
                    200,
                    "You are now logged out"
                )

    @login_manager.user_loader
    def load_user(user_email):
        caps_userEmail = user_email.lower()
        try:
            if session["account_type"] == "tenant":
                exists = mongo.db.tenant.find_one({"email": caps_userEmail})
            elif session["account_type"] == "staff":
                exists = mongo.db.staff.find_one({"email": caps_userEmail})
            if not exists:
                return None
        except KeyError:
            return None
        return User(userEmail=exists["email"].lower())

    @app.route('/test_login/staff')
    def test_login_staff():
        user = User("staff developer login")
        session['account_type'] = "staff"
        login_user(user)
        return serverResponse(None, 200, "You are logged in as a staff for testing purposes")

    @app.route('/test_login/tenant')
    def test_login_tenant():
        user = User("tenant developer login")
        session['account_type'] = "tenant"
        login_user(user)
        return serverResponse(None, 200, "You are logged in as a tenant for testing purposes")
