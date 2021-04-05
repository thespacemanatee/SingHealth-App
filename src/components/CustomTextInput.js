import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Input, useTheme } from "@ui-kitten/components";

import CustomText from "./ui/CustomText";

const CustomTextInput = ({ errorText, description, ...props }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Input size="large" {...props} status={errorText ? "danger" : "basic"} />
      {description && !errorText ? (
        <CustomText
          style={{
            ...styles.description,
            color: theme["color-basic-600"],
          }}
        >
          {description || " "}
        </CustomText>
      ) : null}
      <CustomText style={{ ...styles.error, color: theme["color-danger-700"] }}>
        {errorText || " "}
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  description: {
    fontSize: 12,
    paddingTop: 8,
    position: Platform.OS !== "web" ? "absolute" : "relative",
    bottom: 0,
  },
  error: {
    fontSize: 12,
    paddingTop: 8,
  },
});

export default CustomTextInput;
