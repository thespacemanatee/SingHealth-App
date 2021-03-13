import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { Input, useTheme } from "@ui-kitten/components";

const CustomTextInput = ({ errorText, description, ...props }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Input size="large" {...props} />
      {description && !errorText ? (
        <Text
          style={[
            styles.description,
            {
              color: theme["color-basic-600"],
            },
          ]}
        >
          {description ? description : " "}
        </Text>
      ) : null}
      <Text style={[styles.error, { color: theme["color-danger-700"] }]}>
        {errorText ? errorText : " "}
      </Text>
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
