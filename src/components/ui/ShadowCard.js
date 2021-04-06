import { StyleService, useTheme } from "@ui-kitten/components";
import React from "react";
import { View, TouchableOpacity } from "react-native";

const ShadowCard = ({ style, children, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.shadowContainer}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View
        style={[
          { ...style, ...styles.shadow },
          { backgroundColor: theme["color-primary-100"] },
        ]}
      >
        {children}
      </View>
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
