import React from "react";
import { View } from "react-native";
import { StyleService, Card, useTheme } from "@ui-kitten/components";
import CustomText from "./ui/CustomText";
import ShadowCard from "./ui/ShadowCard";

const EntityCard = ({ onPress, displayName, _id }) => {
  const theme = useTheme();

  const handleOnPress = () => {
    onPress(_id);
  };

  return (
    <ShadowCard
      style={styles.cardContainer}
      status="info"
      activeOpacity={0.5}
      onPress={handleOnPress}
    >
      <View>
        <CustomText style={styles.listContentText}>{displayName}</CustomText>
      </View>
    </ShadowCard>
  );
};

export default EntityCard;

const styles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  listContentText: {
    fontSize: 30,
  },
});
