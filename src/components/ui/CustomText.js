import React from "react";
import { Text } from "react-native";

const CustomText = ({ children, style, bold }) => {
  return (
    <Text
      style={[
        style,
        // eslint-disable-next-line react-native/no-inline-styles
        { fontFamily: bold ? "SFProDisplay-Bold" : "SFProDisplay-Regular" },
      ]}
    >
      {children}
    </Text>
  );
};

export default CustomText;
