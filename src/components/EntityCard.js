import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, useWindowDimensions } from "react-native";
import { StyleService, useTheme } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";

import CustomText from "./ui/CustomText";
import ShadowCard from "./ui/ShadowCard";
import { getS3Image } from "../helpers/utils";

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
    if (image) {
      getImage();
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
