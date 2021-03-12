import React from "react";
import { Image, Dimensions } from "react-native";

const Logo = () => {
  const WINDOW_WIDTH = Dimensions.get("window").width;
  const IMAGE_WIDTH = Dimensions.get("window").width / 1.5;

  return (
    <Image
      source={require("../../../assets/singhealth.png")}
      style={{ height: IMAGE_WIDTH * 0.525, width: IMAGE_WIDTH }}
    />
  );
};

export default Logo;
