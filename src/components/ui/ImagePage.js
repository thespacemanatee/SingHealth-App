import React from "react";
import {
  View,
  Image,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { Button, StyleService, useTheme } from "@ui-kitten/components";
import CustomText from "./CustomText";

const ImagePage = (props) => {
  const { imageUri, selectedIndex, loading, onPress, onDelete } = props;

  const theme = useTheme();

  const windowDimensions = useWindowDimensions();
  const { height } = windowDimensions;

  const IMAGE_HEIGHT = height * 0.5;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

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
              <CustomText style={styles.text}>No Images!</CustomText>
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
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
