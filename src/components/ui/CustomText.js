import React from "react";
import { Text } from "@ui-kitten/components";

const CustomText = ({ children, style, bold, ...props }) => {
  return (
    <Text
      {...props}
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...style,
        fontFamily: bold ? "SFProDisplay-Bold" : "SFProDisplay-Regular",
      }}
    >
      {children}
    </Text>
  );
};

export default CustomText;
