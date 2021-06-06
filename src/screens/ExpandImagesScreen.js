import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { Icon, StyleService } from "@ui-kitten/components";

const THUMBNAIL_SIZE = 80;
const SPACING = 10;
const CROSS_SIZE = 40;

const BackIcon = (props) => (
  <Icon
    {...props}
    name="close-outline"
    fill="gray"
    style={{
      width: CROSS_SIZE,
      height: CROSS_SIZE,
    }}
  />
);

const ExpandImagesScreen = ({ route, navigation }) => {
  const { imageArray, selectedIndex } = route.params;
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const topRef = useRef(null);
  const thumbRef = useRef(null);

  const windowDimensions = useWindowDimensions();
  const { width, height } = windowDimensions;
  const { height: screenHeight } = Dimensions.get("screen");
  const IMAGE_WIDTH = (height / 4) * 3;

  const handleClose = () => {
    if (Platform.OS === "web") {
      window.history.back();
    } else {
      navigation.goBack();
    }
  };

  useEffect(() => {
    scrollToActiveIndex(activeIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToActiveIndex = useCallback(
    (index) => {
      setActiveIndex(index);
      topRef?.current?.scrollToOffset({
        offset: index * width,
        animated: true,
      });
      if (index * (THUMBNAIL_SIZE + SPACING) - THUMBNAIL_SIZE / 2 > width / 2) {
        thumbRef?.current?.scrollToOffset({
          offset:
            index * (THUMBNAIL_SIZE + SPACING) - width / 2 + THUMBNAIL_SIZE / 2,
          animated: true,
        });
      }
    },
    [width]
  );

  const renderImages = useCallback(
    (itemData) => {
      const position = (width - IMAGE_WIDTH) / 2;
      return (
        <View
          style={{
            width,
            height: Platform.OS === "web" ? height : screenHeight,
          }}
        >
          <Image
            source={{ uri: itemData.item }}
            style={[
              StyleSheet.absoluteFillObject,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                width,
                maxWidth: IMAGE_WIDTH,
                left: position > 0 ? position : 0,
              },
            ]}
          />
        </View>
      );
    },
    [IMAGE_WIDTH, height, screenHeight, width]
  );

  const renderThumbnail = useCallback(
    (itemData) => {
      return (
        <TouchableOpacity
          onPress={() => {
            scrollToActiveIndex(itemData.index);
          }}
        >
          <Image
            source={{ uri: itemData.item }}
            style={[
              styles.thumbnail,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                borderColor:
                  activeIndex === itemData.index ? "#fff" : "transparent",
              },
            ]}
          />
        </TouchableOpacity>
      );
    },
    [activeIndex, scrollToActiveIndex]
  );

  return (
    <View style={styles.screen}>
      <View>
        <FlatList
          ref={topRef}
          data={imageArray}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderImages}
          onMomentumScrollEnd={(event) => {
            scrollToActiveIndex(
              Math.floor(event.nativeEvent.contentOffset.x / width + 0.1)
            );
          }}
          horizontal
          pagingEnabled
        />
        <FlatList
          ref={thumbRef}
          data={imageArray}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderThumbnail}
          horizontal
          style={styles.thumbnailList}
          contentContainerStyle={{ paddingHorizontal: SPACING }}
        />
      </View>
      <TouchableOpacity style={styles.crossButton} onPress={handleClose}>
        <BackIcon />
      </TouchableOpacity>
    </View>
  );
};

export default ExpandImagesScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
  crossButton: {
    position: "absolute",
    borderRadius: CROSS_SIZE / 2,
    backgroundColor: "white",
    marginLeft: CROSS_SIZE / 2,
    marginTop: CROSS_SIZE,
  },
  topContainer: {
    backgroundColor: "black",
    // position: "absolute",
  },
  thumbnailList: {
    position: "absolute",
    bottom: THUMBNAIL_SIZE,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 12,
    marginRight: SPACING,
    borderWidth: 2,
  },
});
