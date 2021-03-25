import AsyncStorage from "@react-native-async-storage/async-storage";

import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export const restoreToken = () => {
  return async (dispatch) => {
    try {
      const cache = await AsyncStorage.getItem("userData");
      const userData = JSON.parse(cache);
      console.log("RESTORING TOKEN: ", userData);

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: RESTORE_TOKEN, userData });
    } catch (err) {
      // Restoring token failed
      console.error("RESTORE_TOKEN: no token found in local storage");
    }
  };
};

export const signIn = (user, pswd, userType) => {
  return async (dispatch) => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });

    const loginOptions = {
      url: `${endpoint}login/${userType}`,
      method: "post",
      // withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {
        user,
        pswd,
      },
    };
    const res = await httpClient(loginOptions);
    // .then((res) => {
    const userToken = "dummy-auth-token";
    const { _id, email, institutionID, name } = res.data.data;
    const userData = {
      userType,
      userToken,
      _id,
      email,
      institutionID,
      name,
    };

    dispatch({ type: SIGN_IN, userData });
    saveUserDataToStorage(userData);
    // })
    // .catch((err) => {
    //   handleErrorResponse(err);
    // });
  };
};

export const signOut = () => {
  return async (dispatch) => {
    // dispatch({ action: SIGN_OUT, token: token ? token : null });
    console.log("Signing out!");
    const signOutOptions = {
      url: `${endpoint}logout`,
      method: "get",
      // withCredentials: true,
    };
    await httpClient(signOutOptions);
    // .then((res) => {
    // console.log(res);
    // })
    // .catch((err) => {
    // handleErrorResponse(err);
    // });

    // const token = "dummy-auth-token";

    dispatch({ type: SIGN_OUT });
    removeTokenFromStorage();
  };
};

const saveUserDataToStorage = async (userData) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(userData));
  } catch (err) {
    handleErrorResponse(err);
  }
};

const removeTokenFromStorage = async () => {
  try {
    await AsyncStorage.removeItem("userData");
  } catch (err) {
    handleErrorResponse(err);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const handleErrorResponse = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
    if (err.response.status === 403) {
      signOut();
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", err.message);
  }
  console.error(err.config);
};
