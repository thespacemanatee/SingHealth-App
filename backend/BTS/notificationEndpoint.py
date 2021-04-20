from BTS.utils import serverResponse
from flask_login import login_required
from flask import request



def addNotificationEndpt(app, mongo):
    @app.route("/notifications", methods=["GET"])
    # @login_required
    def getNotifs():
        if request.method == "GET":
            requestArgs = request.args
            userID = requestArgs.get("userID", None)
            if userID == None:
                return serverResponse(
                    None, 
                    400, 
                    "No userID provided"
                    )
            
            notifications = mongo.db.notifications.find(
                {"userID": userID},
                {
                    "userID": 0,
                    "_id": 0}
            )
            if notifications == None:
                return serverResponse(None, 200, "No notifications found")
            elif notifications.count() == 0:
                return serverResponse(None, 200, "No notifications found")

            notifList = []
            for notification in notifications:
                notifList.append(notification)
            
            return serverResponse(
                notifList,
                200,
                "Notifications retrieved successfully"
                )
