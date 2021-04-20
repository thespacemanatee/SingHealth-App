import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { StyleService, useStyleSheet } from "@ui-kitten/components";

const ShadowCard = ({ style, children, onPress, onLongPress }) => {
  const styles = useStyleSheet(themedStyles);
  return (
    <TouchableOpacity
      style={styles.shadowContainer}
      activeOpacity={0.5}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[style, styles.shadow]}>{children}</View>
    </TouchableOpacity>
  );
};

export default ShadowCard;

const themedStyles = StyleService.create({
  shadowContainer: {
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.7,
    borderRadius: 20,
    marginBottom: 10,
  },
  shadow: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: Platform.select({
      web: "#FAFAFA",
      ios: "white",
      android: "white",
    }),
  },
});
