import React, { useState } from "react";
import { ViewPager, StyleService } from "@ui-kitten/components";

import ImagePage from "./ui/ImagePage";

const ImageViewPager = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { imageArray } = props;
  const { index } = props;
  const { section } = props;

  const renderImages = imageArray.map((imageUri) => {
    return (
      <ImagePage
        imageUri={imageUri}
        key={imageUri}
        index={index}
        section={section}
        selectedIndex={selectedIndex}
      />
    );
  });

  return (
    <ViewPager
      style={styles.viewPager}
      selectedIndex={selectedIndex}
      onSelect={(i) => setSelectedIndex(i)}
    >
      {imageArray.length > 0 ? renderImages : <ImagePage />}
    </ViewPager>
  );
};

export default ImageViewPager;

const styles = StyleService.create({
  viewPager: { flex: 1, marginTop: 20 },
});
