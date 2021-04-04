import React from "react";
import { View } from "react-native";
import { StyleService, Card, useTheme } from "@ui-kitten/components";
import CustomText from "./ui/CustomText";

const EntityCard = ({ onPress, displayName, _id }) => {
  const theme = useTheme();

  const handleOnPress = () => {
    onPress(_id);
  };

  return (
    <Card
      style={[styles.item, { backgroundColor: theme["color-info-100"] }]}
      status="info"
      activeOpacity={0.5}
      onPress={handleOnPress}
    >
      <View>
        <CustomText style={styles.listContentText}>{displayName}</CustomText>
      </View>
    </Card>
  );
};

export default EntityCard;

const styles = StyleService.create({
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
  listContentText: {
    fontSize: 30,
  },
});
