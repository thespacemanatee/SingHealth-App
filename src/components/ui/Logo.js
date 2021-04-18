import React from "react";
import { Image } from "react-native";

const image = require("../../../assets/singhealth.png");

const IMAGE_SIZE = 350;

const Logo = () => {
  return (
    <Image
      source={image}
      style={{ height: IMAGE_SIZE * 0.525, width: IMAGE_SIZE }}
    />
  );
};

export default Logo;
