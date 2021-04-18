import statistics
from datetime import datetime, timedelta
from flask import request
from .utils import serverResponse
from flask_login import login_required


def audit_timeframe_endpoint(app, mongo):
    @app.route("/auditTimeframe", methods=["GET"])
    # @login_required
    def get_audit_time_frame():
        try:
            if request.method == "GET":
                fromDate = int(request.args.get("fromDate", 0))
                toDate = int(request.args.get("toDate", 0))
                dataType = request.args.get("dataType", None)
                dataID = request.args.get("dataID", None)

                try:
                    start_date = datetime.fromtimestamp(fromDate/1000.0)
                    end_date = datetime.fromtimestamp(toDate/1000.0)
                except:
                    return serverResponse(None, 200, "Wrong date format")

                start_date = start_date.replace(
                    hour=0, minute=0, second=0, microsecond=0)
                end_date = end_date.replace(
                    hour=23, minute=59, second=59, microsecond=999999)

                query = {"date": {"$gt": start_date, "$lt": end_date}}
                # print(dataType)
                # print(dataID)

                if (dataType is None) and (dataID is None):
                    pass

                elif (dataType == "institution") and not((dataID == "") or (dataID is None)):
                    query["institutionID"] = dataID

                elif (dataType == "tenant") and not((dataID == "") or (dataID is None)):
                    query["tenantID"] = dataID
                else:
                    return serverResponse(None, 200, "Insufficient data or wrong data format")

                audits = mongo.db.audits.find(query)

                if audits.count() < 1:
                    return serverResponse(None, 200, "No audit data found within the timeframe")

                date_arr = []
                score_arr = []
                for audit in audits:
                    date_arr.append(audit["date"])
                    score_arr.append(audit["score"])

                sorted_audit = {}
                for i in range(len(date_arr)):
                    date_diff = date_arr[i] - start_date
                    sorted_audit.setdefault(
                        start_date + timedelta(days=date_diff.days), []).append(score_arr[i])

                # pack data
                data = []
                for date_val in sorted_audit.keys():
                    data.append({"date": date_val.isoformat(), "avgScore": round(
                        statistics.mean(sorted_audit[date_val]), 3)})
                return serverResponse(data, 200, "Success")

        except:
            return serverResponse(None, 404, "No response received")
