import * as React from "react";
import { Image, StyleSheet } from "react-native";
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

import { MAX_HEADER_HEIGHT, HEADER_DELTA } from "./Model";

interface CoverProps {
  y: Animated.SharedValue<number>;
  imageAdded: ImagePicker.ImagePickerResult;
}

export default ({ y, imageAdded }: CoverProps) => {
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            y.value,
            [-MAX_HEADER_HEIGHT, 0],
            [4, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });
  const backgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        y.value,
        [-64, 0, HEADER_DELTA],
        [0, 0.2, 1],
        Extrapolate.CLAMP
      ),
    };
  });
  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Image
        style={styles.image}
        source={{ uri: imageAdded && imageAdded.uri }}
      />
      <Animated.View
        style={[
          styles.background,
          {
            ...StyleSheet.absoluteFillObject,
          },
          backgroundStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: MAX_HEADER_HEIGHT + 100,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    backgroundColor: "white",
  },
});
