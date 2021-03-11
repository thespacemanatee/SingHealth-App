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
    let userToken;

    try {
      userToken = await AsyncStorage.getItem("userToken");
    } catch (e) {
      // Restoring token failed
      console.log("RESTORE_TOKEN: no token found in local storage");
    }

    // After restoring token, we may need to validate it in production apps

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    dispatch({ type: RESTORE_TOKEN, token: userToken });
  };
};

export const signIn = (email, password, userType) => {
  return async (dispatch, getState) => {
    // dispatch({ action: SIGN_IN, token: token ? token : null });

    const loginOptions = {
      url: `${endpoint}test_login/${userType}`,
      method: "get",
    };
    axios(loginOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    dispatch({ type: SIGN_IN, token: "dummy-auth-token" });
    saveTokenToStorage("dummy-auth-token");
  };
};

export const signOut = () => {
  return async (dispatch, getState) => {
    // dispatch({ action: SIGN_OUT, token: token ? token : null });
    console.log("Signing out!");
    const signOutOptions = {
      url: `${endpoint}/logout`,
      method: "get",
    };
    axios(signOutOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    dispatch({ type: SIGN_OUT });
  };
};

const saveTokenToStorage = async (token) => {
  try {
    await AsyncStorage.setItem(
      "userToken",
      JSON.stringify({
        token: token,
      })
    );
  } catch (err) {
    console.error(err);
  }
};
