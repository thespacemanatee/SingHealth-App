import { Alert, Platform } from "react-native";

export const alertPolyfill = (title, description, options, extra) => {
  const result = window.confirm(
    [title, description].filter(Boolean).join("\n")
  );

  if (result) {
    const confirmOption = options.find(({ style }) => style !== "cancel");
    confirmOption && confirmOption.onPress();
    // return 0;
  } else {
    const cancelOption = options.find(({ style }) => style === "cancel");
    cancelOption && cancelOption.onPress();
    // return 1;
  }
};

const alert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default alert;
