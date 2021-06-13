import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import Constants from "expo-constants";
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { MIN_HEADER_HEIGHT, HEADER_DELTA, WEB_PADDINGTOP } from "./Model";

interface HeaderProps {
  y: Animated.SharedValue<number>;
}

export default ({ y }: HeaderProps) => {
  const containerStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        y.value,
        [HEADER_DELTA - 16, HEADER_DELTA],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });
  const titleStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        y.value,
        [HEADER_DELTA - 8, HEADER_DELTA - 4],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });
  return (
    <Animated.View style={[styles.container, containerStyles]}>
      <Animated.Text style={[styles.title, titleStyles]}>
        Create Tenant
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -MIN_HEADER_HEIGHT,
    left: 0,
    right: 0,
    height: MIN_HEADER_HEIGHT,
    paddingTop:
      Platform.OS === "web" ? WEB_PADDINGTOP : Constants.statusBarHeight,
  },
  title: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "400",
  },
});
