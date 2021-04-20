/* eslint-disable global-require */
import React from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ContentLoader } from "../../../index";

let Rect;

if (Platform.OS !== "web") {
  Rect = require("../../../index").Rect;
}

const EntityLoading = (props) => {
  const windowDimensions = useWindowDimensions();
  const { width, height } = windowDimensions;

  const SVG_HEIGHT = 75;
  const len = new Array(Math.ceil(height / SVG_HEIGHT)).fill();
  if (Platform.OS === "web") {
    return len.map((item, index) => {
      return (
        <ContentLoader
          key={String(index)}
          speed={0.8}
          width="100%"
          height={SVG_HEIGHT}
          viewBox={`0 0 ${width} ${SVG_HEIGHT}`}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          {...props}
        >
          <rect x="0" y="15" rx="10" ry="10" width={`${width}`} height="60" />
        </ContentLoader>
      );
    });
  }

  return len.map((item, index) => {
    return (
      <ContentLoader
        key={String(index)}
        speed={0.8}
        width="100%"
        height={SVG_HEIGHT}
        viewBox={`0 0 ${width} ${SVG_HEIGHT}`}
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <Rect x="0" y="15" rx="10" ry="10" width={`${width}`} height="60" />
      </ContentLoader>
    );
  });
};

export default EntityLoading;
