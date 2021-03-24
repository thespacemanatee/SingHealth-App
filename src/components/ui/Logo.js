import React from "react";
import { Image, Dimensions } from "react-native";

const image = require("../../../assets/singhealth.png");

const Logo = () => {
  const IMAGE_WIDTH = Dimensions.get("window").width / 1.5;

  return (
    <Image
      source={image}
      style={{ height: IMAGE_WIDTH * 0.525, width: IMAGE_WIDTH }}
    />
  );
};

export default Logo;
