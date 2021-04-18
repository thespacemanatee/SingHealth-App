import React from "react";
import { Platform, useWindowDimensions } from "react-native";

import { ContentLoader, Rect, Circle } from "../../../index";

const SkeletonLoading = (props) => {
  const windowDimensions = useWindowDimensions();
  const { width, height } = windowDimensions;

  const SVG_HEIGHT = 140;
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
          <rect
            x="10"
            y="30"
            rx="3"
            ry="3"
            width={`${width * 0.6}`}
            height="20"
          />
          <circle cx={`${width - 70}`} cy="70" r="60" />
          <rect
            x="10"
            y="60"
            rx="3"
            ry="3"
            width={`${width * 0.5}`}
            height="20"
          />
          <rect
            x="10"
            y="90"
            rx="3"
            ry="3"
            width={`${width * 0.5}`}
            height="20"
          />
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
        <Rect
          x="10"
          y="30"
          rx="3"
          ry="3"
          width={`${width * 0.6}`}
          height="20"
        />
        <Circle cx={`${width - 70}`} cy="70" r="60" />
        <Rect
          x="10"
          y="60"
          rx="3"
          ry="3"
          width={`${width * 0.5}`}
          height="20"
        />
        <Rect
          x="10"
          y="90"
          rx="3"
          ry="3"
          width={`${width * 0.5}`}
          height="20"
        />
      </ContentLoader>
    );
  });
};

export default SkeletonLoading;
