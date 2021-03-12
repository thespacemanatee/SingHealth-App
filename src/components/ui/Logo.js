import React from "react";
import { Image, Dimensions } from "react-native";

const Logo = () => {
  const WINDOW_WIDTH = Dimensions.get("window").width;

  return (
    <Image
      source={require("../../../assets/singhealth.png")}
      style={{ height: WINDOW_WIDTH * 0.525, width: WINDOW_WIDTH }}
    />
  );
};

export default Logo;
