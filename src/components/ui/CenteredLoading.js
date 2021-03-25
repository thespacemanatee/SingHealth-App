import React from "react";
import { View, ActivityIndicator } from "react-native";
import { StyleService, useTheme } from "@ui-kitten/components";

const CenteredLoading = () => {
  const theme = useTheme();
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme["color-primary-default"]} />
    </View>
  );
};

export default CenteredLoading;

const styles = StyleService.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
