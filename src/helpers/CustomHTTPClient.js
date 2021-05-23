import axios from "axios";
import { Platform } from "react-native";

import {
  ENDPOINT_DEV,
  ENDPOINT_DEV_ANDROID,
  ENDPOINT_PROD_WEB,
  ENDPOINT_PROD_NATIVE,
} from "react-native-dotenv";

export const httpClient = axios.create();

httpClient.defaults.withCredentials = true;

export const endpoint =
  // eslint-disable-next-line no-nested-ternary
  process.env.NODE_ENV === "production"
    ? Platform.OS === "web"
      ? ENDPOINT_PROD_WEB
      : ENDPOINT_PROD_NATIVE
    : Platform.OS === "android"
    ? ENDPOINT_DEV_ANDROID
    : ENDPOINT_DEV;
