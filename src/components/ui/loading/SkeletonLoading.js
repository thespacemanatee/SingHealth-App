import React from "react";
import { Platform } from "react-native";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../helpers/config";

import { ContentLoader, Rect, Circle } from "../../../index";

const SkeletonLoading = (props) => {
  const SVG_HEIGHT = 140;
  const len = new Array(Math.ceil(SCREEN_HEIGHT / SVG_HEIGHT)).fill();
  if (Platform.OS === "web") {
    return len.map((item, index) => {
      return (
        <ContentLoader
          key={String(index)}
          speed={0.8}
          width={SCREEN_WIDTH}
          height={SVG_HEIGHT}
          viewBox="0 0 400 140"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          {...props}
        >
          <rect x="10" y="30" rx="3" ry="3" width="220" height="20" />
          <circle cx="320" cy="70" r="60" />
          <rect x="10" y="60" rx="3" ry="3" width="180" height="20" />
          <rect x="10" y="90" rx="3" ry="3" width="180" height="20" />
        </ContentLoader>
      );
    });
  }

  return len.map((item, index) => {
    return (
      <ContentLoader
        key={String(index)}
        speed={0.8}
        width={SCREEN_WIDTH}
        height={SVG_HEIGHT}
        viewBox="0 0 400 140"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <Rect x="10" y="30" rx="3" ry="3" width="220" height="20" />
        <Circle cx="320" cy="70" r="60" />
        <Rect x="10" y="60" rx="3" ry="3" width="180" height="20" />
        <Rect x="10" y="90" rx="3" ry="3" width="180" height="20" />
      </ContentLoader>
    );
  });
};

export default SkeletonLoading;