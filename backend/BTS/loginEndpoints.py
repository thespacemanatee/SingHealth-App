from flask import Flask, request, session, jsonify, make_response
from flask_login import LoginManager, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from .login import User
from .utils import serverResponse, printJ


def addLoginEndpointsForTenantAndStaff(app, mongo):
    login_manager = LoginManager()
    login_manager.session_protection = None
    login_manager.init_app(app)

    @app.route('/login/staff',  methods=["POST"])
    def login_for_staff():
        """
        TODO:
        implement password hashing
        """
        if request.method == "POST":
            credentials = request.json
            expoToken = credentials.get("expoToken", None)
            userEmail = credentials["user"].lower()
            userPswd = credentials["pswd"]

            user = mongo.db.staff.find_one({"email": userEmail})
            if user:
                dbUserEmail = user['email'].lower()
                # check_password_hash(user["pswd"], credentials["pswd"]):
                if user["pswd"] == credentials["pswd"]:
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
                    return serverResponse(
                        user,
                        200,
                        f"You are now logged in as a staff under: {dbUserEmail}"
                    )
                else:
                    return serverResponse(
                        None,
                        404,
                        "Either user email or pswd is wrong"
                    )

            else:
                return serverResponse(
                    None,
                    404,
                    f"{userEmail} account does not exist"
                )

    @app.route('/login/tenant',  methods=["POST"])
    def login_for_tenant():
        """
        TODO:
        implement password hashing
        """
        if request.method == "POST":
            credentials = request.json
            expoToken = credentials.get("expoToken", None)
            userEmail = credentials["user"].lower()
            userPswd = credentials["pswd"]

            user = mongo.db.tenant.find_one({"email": userEmail})
            if user:
                dbUserEmail = user['email'].lower()
                # check_password_hash(user["pswd"], credentials["pswd"]):
                if user["pswd"] == credentials["pswd"]:
                    user_obj = User(userEmail=dbUserEmail)
                    login_user(user_obj, remember=True)
                    session['account_type'] = "tenant"

                    

                    # TODO: Append the token to the DB
                    if expoToken is not None and expoToken != "" and  \
                        expoToken not in user.get("expoToken",[]):
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

                    return serverResponse(
                        user,
                        200,
                        f"You are now logged in as a tenant under: {dbUserEmail}"
                    )
                else:
                    return serverResponse(
                        None,
                        400,
                        "Either user email or pswd is incorrect"
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

                #TODO：Remove the token from the DB
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
                print("Session lost. Forcefully logging out the user")
            
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
