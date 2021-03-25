import React from "react";
import { View } from "react-native";
import { Text, Card, useTheme, StyleService } from "@ui-kitten/components";
import moment from "moment";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ActiveAuditCard = ({ userType, item, onPress }) => {
  const theme = useTheme();
  return (
    <Card
      style={{ backgroundColor: theme["color-info-100"] }}
      status="info"
      activeOpacity={0.5}
      onPress={onPress}
    >
      <View style={styles.cardContainer}>
        <View style={{}}>
          <Text style={{ fontWeight: "bold" }}>
            {moment(item.date)
              .toLocaleString()
              .split(" ")
              .slice(0, 5)
              .join(" ")}
          </Text>
          <Text>{`${userType === "staff" ? "Tenant" : "You"} scored: ${
            Number.parseFloat(item.score).toPrecision(3) * 100
          }`}</Text>
        </View>
        <View>
          <AnimatedCircularProgress
            size={120}
            width={15}
            rotation={0}
            fill={item.rectificationProgress ? item.rectificationProgress : 1}
            duration={2000}
            tintColor={theme["color-info-500"]}
            backgroundColor={theme["color-danger-600"]}
          />
        </View>
      </View>
    </Card>
  );
};

export default ActiveAuditCard;

const styles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
});
