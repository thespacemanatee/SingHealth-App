import { Platform } from "react-native";
import axios from "axios";

export const httpClient = axios.create();

httpClient.defaults.timeout = 10000;

export let endpoint;

if (Platform.OS === "android") {
  endpoint = "http://10.0.2.2:5000/";
} else {
  endpoint = "http://localhost:5000/";
}
