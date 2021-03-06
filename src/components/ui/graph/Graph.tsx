/* eslint-disable no-nested-ternary */
import React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Svg, { Path, Defs, Stop, LinearGradient } from "react-native-svg";
import * as shape from "d3-shape";
import {
  useSharedValue,
  useDerivedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "@ui-kitten/components";

import { parsePath, getPointAtLength } from "../../AnimatedHelpers";

import Cursor from "./Cursor";
import CustomText from "../CustomText";

const styles = StyleSheet.create({
  container: {
    // height,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
  },
  labelContainer: {
    width: "100%",
    alignItems: "center",
  },
  thresholdContainer: {
    position: "absolute",
    opacity: 0.5,
  },
  thresholdText: {
    marginLeft: 5,
  },
  thresholdLine: {
    height: 0.75,
    backgroundColor: "gray",
  },
  label: {
    color: "gray",
  },
});

const Graph = ({
  label,
  data = [
    { x: new Date(0), y: 100 },
    { x: new Date(1), y: 100 },
  ].map((p) => [p.x.getTime(), p.y]),
  loading,
}) => {
  const theme = useTheme();
  const length = useSharedValue(0);
  const windowDimensions = useWindowDimensions();

  const { width, height: windowHeight } = windowDimensions;
  const height = windowHeight / 5;

  const minX = React.useMemo(() => Math.min(...data.map(([x]) => x)), [data]);
  const maxX = React.useMemo(() => Math.max(...data.map(([x]) => x)), [data]);
  const minY = React.useMemo(() => Math.min(...data.map(([, y]) => y)), [data]);
  const maxY = React.useMemo(() => Math.max(...data.map(([, y]) => y)), [data]);
  const thresholdLine = React.useMemo(
    () => (95 - minY) / (maxY - minY),
    [maxY, minY]
  );

  const domain = {
    x: [minX, maxX],
    y: [minY, maxY],
  };

  const range = {
    x: [0, width],
    y: [height, 0],
  };

  const scale = (v: number, d: number[], r: number[]) => {
    "worklet";

    return interpolate(v, d, r, Extrapolate.CLAMP);
  };

  const scaleInvert = (y: number, d: number[], r: number[]) => {
    "worklet";

    return interpolate(y, r, d, Extrapolate.CLAMP);
  };

  const d = shape
    .line()
    .x(([x]) => scale(x, domain.x, range.x))
    .y(([, y]) => scale(y, domain.y, range.y))
    .curve(shape.curveBasis)(data) as string;
  const path = parsePath(d);

  const point = useDerivedValue(() => {
    const p = getPointAtLength(path, length.value);
    return {
      coord: {
        x: p.x,
        y: p.y,
      },
      data: {
        x: scaleInvert(p.x, domain.x, range.x),
        y: scaleInvert(p.y, domain.y, range.y),
      },
    };
  });

  return (
    <>
      <View style={styles.labelContainer}>
        <CustomText bold={false} style={styles.label}>
          {label}
        </CustomText>
      </View>
      <View style={[styles.container, { height }]}>
        {!loading ? (
          data.length > 2 ? (
            <>
              <View>
                <Svg {...{ width, height }}>
                  <Defs>
                    <LinearGradient
                      x1="50%"
                      y1="0%"
                      x2="50%"
                      y2="100%"
                      id="gradient"
                    >
                      <Stop stopColor={theme["color-danger-200"]} offset="0%" />
                      <Stop
                        stopColor={theme["color-danger-100"]}
                        offset="80%"
                      />
                      <Stop
                        stopColor={theme["color-basic-100"]}
                        offset="100%"
                      />
                    </LinearGradient>
                  </Defs>
                  <Path
                    fill="transparent"
                    stroke={theme["color-danger-600"]}
                    strokeWidth={5}
                    {...{ d }}
                  />
                  <Path
                    d={`${d}  L ${width} ${height} L 0 ${height}`}
                    fill="url(#gradient)"
                  />
                </Svg>
                <View
                  style={[
                    styles.thresholdContainer,
                    { bottom: height * thresholdLine },
                  ]}
                >
                  <View style={styles.thresholdText}>
                    <CustomText bold={false}>95</CustomText>
                  </View>
                  <View style={[styles.thresholdLine, { width }]} />
                </View>
                <Cursor {...{ path, length, point }} />
              </View>
            </>
          ) : (
            <CustomText bold={false}>NOT ENOUGH DATA</CustomText>
          )
        ) : (
          <ActivityIndicator
            size="large"
            color={theme["color-primary-default"]}
          />
        )}
      </View>
    </>
  );
};

export default Graph;
