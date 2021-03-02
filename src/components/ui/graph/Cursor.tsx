import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Platform } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  withDecay,
  runOnJS,
  EasingNode,
} from "react-native-reanimated";

import { Path } from "../../../components/AnimatedHelpers";

import Label, { DataPoint } from "./Label";

const { width } = Dimensions.get("window");
const CURSOR = Platform.OS === "web" ? 30 : 150;
const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(100, 200, 300, 0.4)",
  },
  cursor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#367be2",
    borderWidth: 4,
    backgroundColor: "white",
  },
  label: {
    position: "absolute",
    top: 25,
    // left: 0,
  },
});

interface CursorProps {
  path: Path;
  length: Animated.SharedValue<number>;
  point: Animated.SharedValue<DataPoint>;
}

const Cursor = ({ path, length, point }: CursorProps) => {
  let opacity: Animated.Node<number>;
  if (Platform.OS !== "web") {
    opacity = useState(new Animated.Value(0.5))[0];
  }

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      easing: EasingNode.ease,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0.5,
      duration: 200,
      easing: EasingNode.ease,
    }).start();
  };

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offsetX: number;
      offsetY: number;
    }
  >({
    onStart: (_event, ctx) => {
      if (Platform.OS !== "web") {
        runOnJS(fadeIn)();
      }
      ctx.offsetX = interpolate(
        length.value,
        [0, path.length],
        [0, width],
        Extrapolate.CLAMP
      );
    },
    onActive: (event, ctx) => {
      length.value = interpolate(
        ctx.offsetX + event.translationX,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
    },
    onEnd: ({ velocityX }) => {
      if (Platform.OS !== "web") {
        runOnJS(fadeOut)();
      }
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
    },
  });

  const cursorStyle = useAnimatedStyle(() => {
    const { coord } = point.value;
    const translateX = coord.x - CURSOR / 2;
    const translateY = coord.y - CURSOR / 2;
    return {
      transform: [{ translateX }, { translateY }],
    };
  });
  const labelStyle = useAnimatedStyle(() => {
    const { coord } = point.value;
    const translateX = coord.x - CURSOR / 2;
    const translateY = coord.y - CURSOR / 2;
    return {
      transform: [{ translateX }, { translateY }],
      left: Platform.OS !== "web" ? (coord.x > width / 2 ? -150 : 100) : -85,
    };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler {...{ onGestureEvent }}>
        <Animated.View>
          <Animated.View style={[{ ...styles.cursorContainer }, cursorStyle]}>
            <View style={styles.cursor} />
          </Animated.View>
          <Animated.View style={[{ ...styles.label, opacity }, labelStyle]}>
            <View style={styles.label}>
              <Label {...{ point }} />
            </View>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export default Cursor;
