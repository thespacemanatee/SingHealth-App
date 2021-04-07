import React from "react";
import { Platform } from "react-native";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../../../helpers/config";

import { ContentLoader, Rect } from "../../../index";

const EntityLoading = (props) => {
  const SVG_HEIGHT = 100;
  const len = new Array(Math.ceil(SCREEN_HEIGHT / SVG_HEIGHT)).fill();
  if (Platform.OS === "web") {
    return len.map((item, index) => {
      return (
        <ContentLoader
          key={String(index)}
          speed={0.8}
          width={SCREEN_WIDTH}
          height={80}
          viewBox="0 0 500 80"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          {...props}
        >
          <rect x="0" y="15" rx="10" ry="10" width="480" height="58" />
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
        height={80}
        viewBox="0 0 500 80"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <Rect x="0" y="15" rx="10" ry="10" width="480" height="58" />
      </ContentLoader>
    );
  });
};

export default EntityLoading;
