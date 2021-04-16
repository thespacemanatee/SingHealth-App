import React from "react";
import { Platform, View, FlatList, useWindowDimensions } from "react-native";
import { StyleService } from "@ui-kitten/components";

import ImagePage from "./ui/ImagePage";

const ImageViewPager = (props) => {
  const { imageArray, renderListItems } = props;

  const windowDimensions = useWindowDimensions();
  const { width, height } = windowDimensions;

  const IMAGE_HEIGHT = height * 0.6;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

  return imageArray.length > 0 ? (
    <View style={width}>
      <FlatList
        horizontal
        snapToInterval={IMAGE_WIDTH + 20}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingRight: width - IMAGE_WIDTH - 20 * 3 },
        ]}
        decelerationRate="fast"
        keyExtractor={(item, index) => String(index)}
        data={imageArray}
        renderItem={renderListItems}
        showsHorizontalScrollIndicator={Platform.OS === "web"}
      />
    </View>
  ) : (
    <ImagePage />
  );
};

export default ImageViewPager;

const styles = StyleService.create({
  contentContainer: {
    paddingBottom: 25,
  },
});
