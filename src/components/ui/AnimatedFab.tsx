import { Icon, useTheme } from "@ui-kitten/components";
import React, { useEffect } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BUTTON_WIDTH = 150;
const ICON_SIZE = 56;

const styles = StyleSheet.create({
  fabContainer: {
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    justifyContent: "center",
    alignItems: "flex-start",
    overflow: "hidden",
  },
  iconContainer: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: ICON_SIZE / 2,
    height: ICON_SIZE / 2,
  },
  label: {
    color: "white",
    fontFamily: "SFProDisplay-Bold",
    position: "absolute",
    width: BUTTON_WIDTH,
  },
});

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedFabProps {
  icon: string;
  label?: string;
  showLabel?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const AnimatedFab = ({
  icon,
  label,
  showLabel,
  style,
  onPress,
}: AnimatedFabProps) => {
  const progress = useSharedValue(0);

  const theme = useTheme();

  const animatedFABStyles = useAnimatedStyle(() => {
    return {
      width: interpolate(
        progress.value,
        [0, 1],
        [56, BUTTON_WIDTH],
        Extrapolate.CLAMP
      ),
    };
  });

  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      right: interpolate(
        progress.value,
        [0, 1],
        [-BUTTON_WIDTH, -BUTTON_WIDTH / 3]
      ),
    };
  });

  useEffect(() => {
    if (showLabel) {
      progress.value = withTiming(1, { duration: 100 });
    } else {
      progress.value = withTiming(0, { duration: 100 });
    }
  }, [showLabel]);

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.5}
      style={[
        styles.fabContainer,
        style,
        { backgroundColor: theme["color-primary-500"] },
        animatedFABStyles,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon style={styles.icon} fill="white" name={icon} />
      </View>
      <Animated.Text style={[styles.label, animatedTextStyles]}>
        {label}
      </Animated.Text>
    </AnimatedTouchableOpacity>
  );
};

AnimatedFab.defaultProps = {
  label: "",
  showLabel: false,
  style: null,
};

export default AnimatedFab;
