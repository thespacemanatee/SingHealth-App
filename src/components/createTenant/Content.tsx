import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Icon } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";

import { MAX_HEADER_HEIGHT, MIN_HEADER_HEIGHT } from "./Model";
import Header from "./Header";
import AddTenantContent from "../../screens/staff/AddTenantScreens/AddTenantContent";
import CustomText from "../ui/CustomText";

interface ContentProps {
  navigation: any;
  y: Animated.SharedValue<number>;
  onImageAdded: (image: ImagePicker.ImagePickerResult) => void;
}

const ImageIcon = (props) => (
  <Icon {...props} name="image-outline" fill="gray" style={styles.imageIcon} />
);

export default ({ navigation, y, onImageAdded }: ContentProps) => {
  const [imageAdded, setImageAdded] = useState<ImagePicker.ImagePickerResult>();
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
      opacity: y.value >= MAX_HEADER_HEIGHT ? 0 : 1,
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

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageAdded(result);
      onImageAdded(result);
    }
  };

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
              colors={["transparent", "rgba(0, 0, 0, 0.2)", "white"]}
            />
          </Animated.View>
        )}
        {!imageAdded && (
          <Animated.View style={imageStyle}>
            <Pressable onPress={handleAddImage} style={styles.imageContainer}>
              <ImageIcon />
              <CustomText style={styles.imageText}>Create Tenant</CustomText>
            </Pressable>
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
  },
  gradient: {
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: "center",
  },
  imageIcon: {
    height: 100,
    width: 100,
  },
  imageContainer: {
    alignItems: "center",
  },
  imageText: {
    textAlign: "center",
    fontSize: 36,
    marginTop: 16,
  },
});
