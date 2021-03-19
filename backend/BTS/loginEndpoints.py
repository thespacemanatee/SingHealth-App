from flask import Flask, request, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
from .login import User
from .utils import successMsg, failureMsg, successResponse, failureResponse, printJ

def addLoginEndpointsForTenantAndStaff(app, mongo):
    login_manager = LoginManager()
    login_manager.init_app(app)

    if app.config.get("SECRET_KEY", None) == None:
        raise Exception("""
            Please set a valid session secret key with the following code:
            import secrets
            app.config["SECRET_KEY"] = secrets.token_urlsafe(nbytes=32)
            """)

    @app.route('/login/staff',  methods=["GET"])
    def login_for_staff():
        """
        TODO:
        implement password hashing
        """
        if request.method == "GET":
            credentials = request.json
            user = mongo.db.staff.find_one({"email": credentials["user"]})
            if user:
                if user["pswd"] == credentials["pswd"]: #check_password_hash(user["pswd"], credentials["pswd"]):
                    user_obj = User(userEmail=user['email'])
                    login_user(user_obj)
                    session['account_type'] = "staff"
                    return successResponse(successMsg(f"You are now logged in as a staff under: {user['email']}"))
                else:
                    return failureResponse(failureMsg("Either user or pswd is wrong", 400), 400)

            
            else:
                return failureResponse(failureMsg(f"{credentials['user']} account does not exist", 404), 404)

    @app.route('/login/tenant')
    def login_for_tenant():
        """
        TODO:
        implement password hashing
        """
        if request.method == "GET":
            credentials = request.get_json(silent=True)
            user = mongo.db.tenants.find_one({"email": credentials["user"]})
            if user:
                if user["pswd"] == credentials["pswd"]:#check_password_hash(user["pswd"], credentials["pswd"]):
                    user_obj = User(userEmail=user['email'])
                    login_user(user_obj)
                    session['account_type'] = "tenant"
                    return successResponse(successMsg(f"You are now logged in as a tenant under: {user['email']}"))
                else:
                    return failureResponse(failureMsg("Either user or pswd is wrong", 400), 400)

            
            else:
                return failureResponse(failureMsg(f"{credentials['user']} account does not exist", 404), 404)


    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return successResponse(successMsg("You are now logged out"))

    @login_manager.user_loader
    def load_user(user_id):
        """
        #TODO: Find a user in the db with with ID matching user_id, create a user object and return it.
        If this user ID doesn't exist in the DB, return None. The user will not be logged in
        """
        print("Loading user")
        return User(user_id)


    @app.route('/test_login/staff')
    def test_login_staff():
        user = User("staff developer login")
        session['account_type'] = "staff"
        login_user(user)
        return successResponse(successMsg("You are logged in as a staff for testing purposes"))

    @app.route('/test_login/tenant')
    def test_login_tenant():
        user = User("tenant developer login")
        session['account_type'] = "tenant"
        login_user(user)
        return successResponse(successMsg("You are logged in as a tenant for testing purposes"))