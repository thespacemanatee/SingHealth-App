import React from "react";
import { View } from "react-native";
import { StyleService, Card } from "@ui-kitten/components";

import CustomText from "./ui/CustomText";

const NotificationCard = ({
  _id,
  headerText,
  message,
  data,
  onPress,
  duration,
  readReceipt,
}) => {
  const { stallName, auditID, message: navProps } = data;

  const handleOnPress = () => {
    onPress({ _id, auditID, stallName, navProps, readReceipt });
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
