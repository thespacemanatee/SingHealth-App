import axios from "axios";
import { Platform } from "react-native";

export const httpClient = axios.create();

httpClient.defaults.timeout = 10000;
httpClient.defaults.withCredentials = true;

// export const endpoint = "https://singhealth-backend-bts.herokuapp.com/";
export let endpoint;

if (Platform.OS === "android") {
  endpoint = "http://10.0.2.2:5000/";
} else {
  endpoint = "http://localhost:5000/";
}
