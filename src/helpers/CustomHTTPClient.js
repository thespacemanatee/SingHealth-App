import axios from "axios";
import { Platform } from "react-native";

export const httpClient = axios.create();

httpClient.defaults.withCredentials = true;

export const endpoint =
  Platform.OS === "web"
    ? "https://singhealth-backend-sessionless.herokuapp.com/"
    : "https://singhealth-backend-bts.herokuapp.com/";
