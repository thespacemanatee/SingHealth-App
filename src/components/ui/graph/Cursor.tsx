import React, { useState } from "react";
import { View, StyleSheet, Platform, useWindowDimensions } from "react-native";
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

import { Path } from "../../AnimatedHelpers";

import Label, { DataPoint, LABEL_SIZE } from "./Label";

const CURSOR = 150;
const styles = StyleSheet.create({
  cursorContainer: {
    width: CURSOR,
    height: CURSOR,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(100, 200, 300, 0.4)",
  },
  lineContainer: {
    position: "absolute",
    width: CURSOR,
    justifyContent: "center",
    alignItems: "center",
  },
  cursor: {
    width: 15,
    height: 15,
    borderRadius: 15,
    borderColor: "#D84622",
    borderWidth: 3,
    backgroundColor: "white",
  },
  line: {
    width: 1,
    backgroundColor: "grey",
  },
  label: {
    position: "absolute",
    top: 20,
  },
});

interface CursorProps {
  path: Path;
  length: Animated.SharedValue<number>;
  point: Animated.SharedValue<DataPoint>;
}

const Cursor = ({ path, length, point }: CursorProps) => {
  const opacity = useState(new Animated.Value(0))[0];
  const [webOpacity, setWebOpacity] = useState(0);

  const windowDimensions = useWindowDimensions();

  const { width, height: windowHeight } = windowDimensions;
  const height = windowHeight / 5;

  const fadeIn = () => {
    if (Platform.OS === "web") {
      setWebOpacity(1);
    } else {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: EasingNode.ease,
      }).start();
    }
  };

  const fadeOut = () => {
    if (Platform.OS === "web") {
      setWebOpacity(0);
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        easing: EasingNode.ease,
      }).start();
    }
  };

  const onGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    {
      offsetX: number;
      offsetY: number;
    }
  >({
    onStart: (_event, ctx) => {
      runOnJS(fadeIn)();
      ctx.offsetX = interpolate(
        length.value,
        [0, path.length],
        [0, width],
        Extrapolate.CLAMP
      );
    },
    onActive: (event, ctx) => {
      // eslint-disable-next-line no-param-reassign
      length.value = interpolate(
        ctx.offsetX + event.translationX,
        [0, width],
        [0, path.length],
        Extrapolate.CLAMP
      );
    },
    onEnd: ({ velocityX }) => {
      runOnJS(fadeOut)();
      // eslint-disable-next-line no-param-reassign
      length.value = withDecay({
        velocity: velocityX,
        clamp: [0, path.length],
      });
    },
  });

  const cursorStyle = useAnimatedStyle(() => {
    const { coord } = point.value;
    const translateX = coord.x - CURSOR / 2 || 0;
    const translateY = coord.y - CURSOR / 2 || 0;
    return {
      transform: [{ translateX }, { translateY }],
    };
  });
  const lineStyle = useAnimatedStyle(() => {
    const { coord } = point.value;
    const translateX = coord.x - CURSOR / 2 || 0;
    return {
      transform: [{ translateX }],
    };
  });
  const labelStyle = useAnimatedStyle(() => {
    const { coord } = point.value;
    const translateX = coord.x - CURSOR / 2 || 0;
    const MARGIN = 100;
    return {
      transform: [
        {
          translateX:
            (coord.x > LABEL_SIZE + MARGIN * 2 - CURSOR
              ? translateX - LABEL_SIZE + MARGIN / 2
              : MARGIN - CURSOR / 2) || 0,
        },
      ],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View>
          <Animated.View
            style={[
              [
                styles.lineContainer,
                { opacity: Platform.OS === "web" ? webOpacity : opacity },
              ],
              lineStyle,
            ]}
          >
            <View style={[styles.line, { height }]} />
          </Animated.View>
          <Animated.View style={[styles.cursorContainer, cursorStyle]}>
            <View style={styles.cursor} />
          </Animated.View>
          <Animated.View
            style={[
              [
                styles.label,
                { opacity: Platform.OS === "web" ? webOpacity : opacity },
              ],
              labelStyle,
            ]}
          >
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
