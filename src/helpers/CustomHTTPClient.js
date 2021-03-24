import { Platform } from "react-native";
import axios from "axios";

export const httpClient = axios.create();

httpClient.defaults.timeout = 10000;

export const endpoint = "https://singhealth-backend-bts.herokuapp.com/";

// if (Platform.OS === "android") {
//   endpoint = "http://10.0.2.2:5000/";
// } else {
//   endpoint = "http://localhost:5000/";
// }
