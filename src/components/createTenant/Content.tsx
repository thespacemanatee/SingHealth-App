import React from "react";
import { StyleSheet, View, Platform, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from "./Model";
import Header from "./Header";
import AddTenantContent from "../../screens/staff/AddTenantScreens/AddTenantContent";

interface ContentProps {
  navigation: any;
  y: Animated.SharedValue<number>;
  imageAdded: ImagePicker.ImagePickerResult;
  // onImageAdded: (image: ImagePicker.ImagePickerResult) => void;
}

export default ({ navigation, y, imageAdded }: ContentProps) => {
  // const [imageAdded, setImageAdded] = useState<ImagePicker.ImagePickerResult>();
  const handler = useAnimatedScrollHandler((event) => {
    // eslint-disable-next-line no-param-reassign
    y.value = event.contentOffset.y;
  });
  const gradientStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        y.value,
        [-MAX_HEADER_HEIGHT, 0],
        [0, MAX_HEADER_HEIGHT],
        Extrapolate.CLAMP
      ),
      opacity: interpolate(
        y.value,
        [-MAX_HEADER_HEIGHT, 0, MAX_HEADER_HEIGHT],
        [0, 1, 0],
        Extrapolate.CLAMP
      ),
    };
  });
  const imageStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        y.value,
        [-MAX_HEADER_HEIGHT / 2, 0, MAX_HEADER_HEIGHT / 2],
        [0, 1, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <Animated.ScrollView
      onScroll={handler}
      style={styles.container}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1}
      stickyHeaderIndices={[1]}
    >
      <View style={styles.cover}>
        {imageAdded && (
          <Animated.View style={[styles.gradient, gradientStyle]}>
            <LinearGradient
              style={StyleSheet.absoluteFill}
              start={[0, 0.3]}
              end={[0, 1]}
              colors={["transparent", "white"]}
            />
          </Animated.View>
        )}
        {!imageAdded && (
          <Animated.View style={[styles.titleContainer, imageStyle]}>
            <Text style={styles.titleText}>Create Tenant</Text>
          </Animated.View>
        )}
      </View>
      <Header {...{ y }} />
      <AddTenantContent {...{ navigation, imageAdded }} />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: MIN_HEADER_HEIGHT,
  },
  cover: {
    height: MAX_HEADER_HEIGHT,
    justifyContent: Platform.select({ web: "center" }),
  },
  gradient: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
  },
  titleContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 36,
    marginTop: 16,
    fontFamily: "SFProDisplay-Regular",
  },
});
