from flask import Flask, request, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_pymongo import PyMongo
from .login import User
from .utils import successMsg, failureMsg, successResponse, failureResponse

def addLoginEndpointsForTenantAndStaff(app, mongo):
    login_manager = LoginManager()
    login_manager.init_app(app)

    if app.config.get("SECRET_KEY", None) == None:
        raise Exception("""
            Please set a valid session secret key with the following code:
            import secrets
            app.config["SECRET_KEY"] = secrets.token_urlsafe(nbytes=32)
            """)

    @app.route('/login/staff')
    def login_for_staff():
        """
        TODO:
        go to mongodb, find user based on username. If it doesn't exist, return error 400 
        Find the corresponding password from the db
        compare it with the incoming password
        if passwords match, apply login_user(user) function return successMsg
        """
        user = User("ZX staff")
        print("Logging in user as staff")
        session['account_type'] = "staff"
        login_user(user)
        return f"You are now logged in as {session['account_type']}!"

    @app.route('/login/tenant')
    def login_for_tenant():
        """
        TODO:
        go to mongodb, find user based on username. If it doesn't exist, return error 400 
        Find the corresponding password from the db
        compare it with the incoming password
        if passwords match, apply login_user(user) function return successMsg
        """
        user = User("ZX tenant")
        print("Logging in user as tenant")
        session['account_type'] = "tenant"
        print(type(session))
        login_user(user)
        return f"You are now logged in as {session['account_type']}!"

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