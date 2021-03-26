import React from "react";
import { View, Platform } from "react-native";
import { StyleService } from "@ui-kitten/components";

let SkeletonPlaceholder;
if (Platform.OS !== "web") {
  // eslint-disable-next-line global-require
  SkeletonPlaceholder = require("react-native-skeleton-placeholder").default;
}

const SkeletonLoading = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.skeletonContainer}>
        {/* <View style={{ width: 60, height: 60, borderRadius: 50 }} /> */}
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
        <View style={styles.skeleton} />
      </View>
    </SkeletonPlaceholder>
  );
};

export default SkeletonLoading;

const styles = StyleService.create({
  skeletonContainer: {
    margin: 20,
  },
  skeleton: {
    height: 75,
    borderRadius: 4,
    marginVertical: 10,
  },
});
