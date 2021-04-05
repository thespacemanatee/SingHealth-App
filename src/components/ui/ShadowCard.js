import { StyleService } from "@ui-kitten/components";
import React from "react";
import { View, TouchableOpacity } from "react-native";

const ShadowCard = ({ style, children, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.shadowContainer}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={{ ...style, ...styles.shadow }}>{children}</View>
    </TouchableOpacity>
  );
};

export default ShadowCard;

const styles = StyleService.create({
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
  },
});
