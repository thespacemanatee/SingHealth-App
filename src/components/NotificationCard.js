import React from "react";
import { View } from "react-native";
import { StyleService, Card } from "@ui-kitten/components";

import CustomText from "./ui/CustomText";

const NotificationCard = ({ headerText, message, data, onPress, duration }) => {
  const { stallName, auditID, message: rectificationDetailsProps } = data;

  const handleOnPress = () => {
    onPress(auditID, stallName, rectificationDetailsProps);
  };

  const Header = (headerProps) => (
    <View {...headerProps} style={styles.header}>
      <CustomText bold style={styles.font}>
        {headerText}
      </CustomText>
      <CustomText style={styles.font}>{`${duration} ago`}</CustomText>
    </View>
  );

  return (
    <Card
      onPress={handleOnPress}
      header={(props) => <Header {...props} stallName={stallName} />}
    >
      <CustomText>{message}</CustomText>
    </Card>
  );
};

export default NotificationCard;

const styles = StyleService.create({
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
