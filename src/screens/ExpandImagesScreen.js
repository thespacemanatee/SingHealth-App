import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  const { imageArray } = route.params;
  const { selectedIndex } = route.params;

  const topRef = useRef(null);
  const thumbRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const { width, height } = Dimensions.get("window");

  const handleClose = () => {
    navigation.goBack();
  };

  useEffect(() => {
    scrollToActiveIndex(activeIndex);
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
      return (
        <View style={{ width, height }}>
          <Image
            source={{ uri: itemData.item }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      );
    },
    [height, width]
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
    <SafeAreaView style={styles.screen}>
      <View>
        <FlatList
          ref={topRef}
          data={imageArray}
          keyExtractor={(item) => item}
          renderItem={renderImages}
          onMomentumScrollEnd={(event) => {
            scrollToActiveIndex(
              Math.floor(event.nativeEvent.contentOffset.x / width + 0.1)
            );
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={Platform.OS === "web"}
        />
        <FlatList
          ref={thumbRef}
          data={imageArray}
          keyExtractor={(item) => item}
          renderItem={renderThumbnail}
          horizontal
          showsHorizontalScrollIndicator={Platform.OS === "web"}
          style={styles.thumbnailList}
          contentContainerStyle={{ paddingHorizontal: SPACING }}
        />
      </View>
      <TouchableOpacity style={styles.crossButton} onPress={handleClose}>
        <BackIcon />
      </TouchableOpacity>
    </SafeAreaView>
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
    margin: CROSS_SIZE / 2,
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
