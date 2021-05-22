import { store } from "../store/store";
import * as authActions from "../store/actions/authActions";
import * as checklistActions from "../store/actions/checklistActions";
import * as databaseActions from "../store/actions/databaseActions";
import alert from "../components/CustomAlert";
import { httpClient, endpoint } from "./CustomHTTPClient";

// eslint-disable-next-line import/prefer-default-export
export const handleErrorResponse = (err, action) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = err.response;
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
    alert("Request timeout", "Check your internet connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(err);
  }
};

export const getS3Image = async (fileName) => {
  const { data } = await httpClient(`${endpoint}images/download-url`, {
    params: {
      fileName,
    },
  });
  return data.data;
};
