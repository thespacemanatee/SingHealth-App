from BTS.utils import serverResponse
from flask_login import login_required
from flask import request



def addNotificationEndpt(app, mongo):
    @app.route("/notifications", methods=["GET","PATCH"])
    @login_required
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
                {"userID": 0}
            )
            if notifications == None:
                return serverResponse(None, 200, "No notifications found")
            elif notifications.count() == 0:
                return serverResponse(None, 200, "No notifications found")

            notifList = []
            for notification in notifications:
                notifList.append(notification)
            
            notifList.reverse()
            return serverResponse(
                notifList,
                200,
                "Notifications retrieved successfully"
                )
        
        elif request.method == "PATCH":
            requestArgs = request.args
            notifID = requestArgs.get("notifID", None)
            if notifID == None:
                return serverResponse(
                    None, 
                    400, 
                    "No notification ID provided"
                    )
            
            updateResult = mongo.db.notifications.update_one(
                {"_id": notifID},
                {
                    "$set": {
                        "readReceipt": True
                    }
                }
            )

            if not updateResult.acknowledged:
                return serverResponse(None, 503, "Failed to update the database")

            return serverResponse(None, 200, "Sent read receipt")

            
