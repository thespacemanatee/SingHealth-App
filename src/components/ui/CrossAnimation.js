import { StyleService } from "@ui-kitten/components";
import React, { useEffect, useRef } from "react";
import { LottieView } from "../..";

const sourceFile = require("../../../assets/cross.json");

const CrossAnimation = ({ loading }) => {
  const animation = useRef(null);

  useEffect(() => {
    animation.current.play();
  });

  return (
    <LottieView
      style={styles.animation}
      ref={animation}
      loop={loading}
      source={sourceFile}
      resizeMode="cover"
    />
  );
};

export default CrossAnimation;

const styles = StyleService.create({
  animation: {
    height: 160,
    width: 160,
  },
});
