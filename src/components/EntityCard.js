import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import { StyleService, useTheme } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import CustomText from "./ui/CustomText";
import ShadowCard from "./ui/ShadowCard";
import { getS3Image, blobToBase64 } from "../helpers/utils";

const CARD_HEIGHT = 100;

const EntityCard = ({
  onPress,
  onLongPress,
  displayName,
  timestamp,
  image,
}) => {
  const [imageUri, setImageUri] = useState();
  const { width } = useWindowDimensions();

  const theme = useTheme();

  useEffect(() => {
    const getImage = async () => {
      const destination = `${FileSystem.cacheDirectory}${image}`;
      const cachedImage = await FileSystem.getInfoAsync(destination);
      if (cachedImage.exists) {
        setImageUri(cachedImage.uri);
      } else {
        const url = await getS3Image(image);
        const downloadImage = await FileSystem.downloadAsync(url, destination);
        setImageUri(downloadImage.uri);
      }
    };
    const getImageWeb = async () => {
      const imageCache = await AsyncStorage.getItem("imageCache");
      if (imageCache === null) {
        const url = await getS3Image(image);
        const uri = await axios(url, { responseType: "blob" });
        const base64Image = await blobToBase64(uri.data);
        setImageUri(base64Image);
        AsyncStorage.setItem(
          "imageCache",
          JSON.stringify({ [image]: JSON.stringify(base64Image) })
        );
      } else {
        const cacheJson = JSON.parse(imageCache);
        if (cacheJson[image]) {
          setImageUri(JSON.parse(cacheJson[image]));
        } else {
          const url = await getS3Image(image);
          const uri = await axios(url, { responseType: "blob" });
          const base64Image = await blobToBase64(uri.data);
          setImageUri(base64Image);
          cacheJson[image] = JSON.stringify(base64Image);
          AsyncStorage.setItem("imageCache", JSON.stringify(cacheJson));
        }
      }
    };
    if (image) {
      if (Platform.OS === "web") {
        getImageWeb();
      } else {
        getImage();
      }
    } else {
      setImageUri(null);
    }
  }, [image]);

  return (
    <ShadowCard
      style={styles.cardContainer}
      status="info"
      activeOpacity={0.5}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {imageUri ? (
        <Image style={[styles.image, { width }]} source={{ uri: imageUri }} />
      ) : (
        <View
          style={[
            styles.image,
            {
              width,
              backgroundColor: theme["color-primary-300"],
            },
          ]}
        />
      )}
      <LinearGradient
        style={StyleSheet.absoluteFill}
        start={[1, 0]}
        end={[0, 1]}
        colors={["'rgba(255, 255, 255, 0)'", "rgba(255, 255, 255, 0.8)"]}
      />
      <View style={[styles.entityTextContainer, { maxWidth: width - 60 }]}>
        <CustomText numberOfLines={1} bold style={styles.entityContentText}>
          {displayName.toUpperCase()}
        </CustomText>
        {timestamp && (
          <CustomText style={styles.entityTimestampText}>
            {timestamp}
          </CustomText>
        )}
      </View>
    </ShadowCard>
  );
};

export default EntityCard;

const styles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    height: CARD_HEIGHT,
  },
  entityTextContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  entityContentText: {
    fontSize: 20,
  },
  entityTimestampText: {
    fontSize: 16,
  },
});
