import moment from "moment";
import { store } from "../store/store";

import * as authActions from "../store/actions/authActions";
import * as checklistActions from "../store/actions/checklistActions";
import * as databaseActions from "../store/actions/databaseActions";
import alert from "../components/CustomAlert";

export const formatDuration = (time) => {
  const seconds = moment.duration(time).seconds();
  const minutes = moment.duration(time).minutes();
  const hours = moment.duration(time).hours();
  const days = moment.duration(time).days();
  const weeks = moment.duration(time).weeks();
  const months = moment.duration(time).months();
  const years = moment.duration(time).years();
  if (years > 0) {
    return `${years}${years > 1 ? " years" : " year"}`;
  }
  if (months > 0) {
    return `${months}${months > 1 ? " months" : " month"}`;
  }
  if (weeks > 0) {
    return `${weeks}${weeks > 1 ? " weeks" : " week"}`;
  }
  if (days > 0) {
    return `${days}${days > 1 ? " days" : " day"}`;
  }
  if (hours > 0) {
    return `${hours}hr ${minutes}min`;
  }
  if (minutes > 0) {
    return `${minutes}min`;
  }
  return `${seconds}s`;
};

// eslint-disable-next-line import/prefer-default-export
export const handleErrorResponse = (err, action) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status, headers } = err.response;
    console.error(data);
    console.error(status);
    console.error(headers);
    if (status === 401 || status === 403) {
      store.dispatch(authActions.signOut());
      store.dispatch(checklistActions.clear());
      store.dispatch(databaseActions.clear());
    } else {
      switch (Math.floor(err.response.status / 100)) {
        case 4:
          alert(
            "Error",
            data.description,
            action
              ? [
                  { text: "Cancel", style: "cancel" },
                  { text: "Confirm", onPress: action },
                ]
              : [{ text: "Okay" }]
          );
          break;

        case 5:
          alert("Server Error", "Please contact your administrator.");
          break;

        default:
          alert("Request timeout", "Check your internet connection.");
          break;
      }
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(err.request);
    alert("Request timeout", "Check your internet connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", err.message);
  }
  console.error(err.config);
};
