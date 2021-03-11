import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, useTheme } from "@ui-kitten/components";

const CustomTextInput = ({ errorText, description, ...props }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Input
        style={[styles.input]}
        {...props}
      />
      {description && !errorText ? (
        <Text style={[styles.description, { color: theme["color-basic-600"] }]}>
          {description}
        </Text>
      ) : null}
      {errorText ? (
        <Text style={[styles.error, { color: theme["color-danger-700"] }]}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  input: {},
  description: {
    fontSize: 13,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    paddingTop: 8,
  },
});

export default CustomTextInput;
