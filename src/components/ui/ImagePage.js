import React from "react";
import {
  View,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Button, StyleService, useTheme } from "@ui-kitten/components";
import CustomText from "./CustomText";

const ImagePage = (props) => {
  const { height } = Dimensions.get("window");
  const IMAGE_HEIGHT = height * 0.5;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

  const theme = useTheme();

  const { imageUri } = props;
  const { selectedIndex } = props;
  const { loading } = props;
  const { onPress } = props;
  const { onDelete } = props;

  const handleDeleteImage = () => {
    onDelete(selectedIndex);
  };

  return (
    <Pressable style={styles.screen} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <View>
            <Image
              style={{
                ...styles.image,
                height: IMAGE_HEIGHT,
                width: IMAGE_WIDTH,
              }}
              source={{
                uri: imageUri,
              }}
            />
            {onDelete ? (
              <Button
                style={styles.button}
                appearance="ghost"
                status="control"
                size="giant"
                onPress={handleDeleteImage}
              >
                Delete
              </Button>
            ) : null}
          </View>
        ) : (
          <View
            style={{
              ...styles.image,
              height: IMAGE_HEIGHT,
              width: IMAGE_WIDTH,
            }}
          >
            {!loading ? (
              <CustomText style={styles.text}>
                No Images. Start adding some!
              </CustomText>
            ) : (
              <ActivityIndicator
                size="large"
                color={theme["color-primary-default"]}
              />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default ImagePage;

const styles = StyleService.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  imageContainer: {
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.7,
    borderRadius: 20,
  },
  image: {
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  text: {
    textAlign: "center",
  },
});
