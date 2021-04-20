import React, { useEffect, useRef } from "react";
import { LottieView } from "../..";

const sourceFile = require("../../../assets/success.json");

const SuccessAnimation = ({ loading }) => {
  const animation = useRef(null);

  useEffect(() => {
    if (loading) {
      animation.current.play(0, 45);
    } else {
      animation.current.play();
    }
  }, [loading]);

  return <LottieView ref={animation} loop={loading} source={sourceFile} />;
};

export default SuccessAnimation;
