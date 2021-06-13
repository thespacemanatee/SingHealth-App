import { Dimensions, Platform } from "react-native";
import Constants from "expo-constants";

const { height } = Dimensions.get("screen");
const φ = (1 + Math.sqrt(5)) / 2;

export const MIN_HEADER_HEIGHT =
  Platform.OS === "web" ? 0 : 64 + Constants.statusBarHeight;
export const MAX_HEADER_HEIGHT = height * (1 - 1 / φ);
export const HEADER_DELTA = MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT;
export const WEB_PADDINGTOP = 15;
