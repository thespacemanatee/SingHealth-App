import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Button, StyleService, useTheme } from "@ui-kitten/components";

import alert from "../CustomAlert";
import * as checklistActions from "../../store/actions/checklistActions";

const ImagePage = (props) => {
  const { height } = Dimensions.get("window");
  const IMAGE_HEIGHT = height * 0.5;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

  const theme = useTheme();

  const { imageUri } = props;
  const { index } = props;
  const { section } = props;
  const { selectedIndex } = props;
  const { loading } = props;
  const { rectify } = props;
  const { onPress } = props;

  const dispatch = useDispatch();

  const handleAlert = useCallback(() => {
    alert("Delete Image", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(checklistActions.deleteImage(section, index, selectedIndex));
        },
      },
    ]);
  }, [dispatch, index, section, selectedIndex]);

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
            {!rectify ? (
              <Button
                style={styles.button}
                appearance="ghost"
                status="control"
                size="giant"
                onPress={handleAlert}
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
              <Text style={styles.text}>No Images. Start adding some!</Text>
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
  button: { position: "absolute", right: 0, bottom: 0 },
  text: { textAlign: "center" },
});
