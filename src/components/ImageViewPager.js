import React from "react";
import { Platform, View, FlatList } from "react-native";
import { StyleService } from "@ui-kitten/components";

import ImagePage from "./ui/ImagePage";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../helpers/config";

const ImageViewPager = (props) => {
  const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

  const { imageArray } = props;
  const { renderListItems } = props;

  return imageArray.length > 0 ? (
    <View style={SCREEN_WIDTH}>
      <FlatList
        horizontal
        snapToInterval={IMAGE_WIDTH + 20}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingRight: SCREEN_WIDTH - IMAGE_WIDTH - 20 * 3 },
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
