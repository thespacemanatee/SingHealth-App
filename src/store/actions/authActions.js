import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const RESTORE_TOKEN = "RESTORE_TOKEN";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

let endpoint;

if (Platform.OS === "android") {
  endpoint = "http://10.0.2.2:5000/";
} else {
  endpoint = "http://localhost:5000/";
}

export const restoreToken = () => {
  return async (dispatch, getState) => {
    let userData;
    let jsonData;

    try {
      userData = await AsyncStorage.getItem("userData");
      jsonData = JSON.parse(userData);

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({
        type: RESTORE_TOKEN,
        userType: jsonData.userType,
        token: jsonData.userToken,
      });
    } catch (e) {
      // Restoring token failed
      console.log("RESTORE_TOKEN: no token found in local storage");
    }
  };
};

export const signIn = (email, password, userType) => {
  return async (dispatch, getState) => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });

    const loginOptions = {
      url: `${endpoint}test_login/${userType}`,
      method: "get",
      withCredentials: true,
    };
    axios(loginOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    let userToken = "dummy-auth-token";

    dispatch({ type: SIGN_IN, userType: userType, userToken: userToken });
    saveUserDataToStorage(userToken, userType);
  };
};

export const signOut = () => {
  return async (dispatch, getState) => {
    // dispatch({ action: SIGN_OUT, token: token ? token : null });
    console.log("Signing out!");
    const signOutOptions = {
      url: `${endpoint}logout`,
      method: "get",
      withCredentials: true,
    };
    axios(signOutOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    let token = "dummy-auth-token";

    dispatch({ type: SIGN_OUT });
    removeTokenToStorage(token);
  };
};

export const saveUserDataToStorage = async (userToken, userType) => {
  try {
    await AsyncStorage.setItem(
      "userData",
      JSON.stringify({
        userToken: userToken,
        userType: userType,
      })
    );
  } catch (err) {
    console.error(err);
  }
};

export const removeTokenToStorage = async (token) => {
  try {
    await AsyncStorage.removeItem("userData");
  } catch (err) {
    console.error(err);
  }
};
