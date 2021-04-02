import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Text, Card, useTheme, StyleService } from "@ui-kitten/components";
import moment from "moment";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const ActiveAuditCard = ({ userType, item, onPress }) => {
  const animation = useRef(null);
  const theme = useTheme();
  const [progress, setProgress] = useState(1);
  const { auditMetadata, stallName } = item;

  console.log("ITEM", item);

  const handleOnPress = () => {
    onPress(auditMetadata._id, stallName);
  };

  useEffect(() => {
    const temp = Number.parseFloat(
      (Number.parseFloat(auditMetadata.rectificationProgress) * 100).toFixed(1)
    );
    if (temp > 0) {
      setProgress(temp);
    }
  }, [auditMetadata.rectificationProgress]);

  return (
    <Card
      style={{ backgroundColor: theme["color-info-100"] }}
      status="info"
      activeOpacity={0.5}
      onPress={handleOnPress}
    >
      <View style={styles.cardContainer}>
        <View style={{}}>
          <Text style={styles.timeStamp}>{stallName}</Text>
          <Text style={styles.timeStamp}>
            {moment(auditMetadata.date)
              .toLocaleString()
              .split(" ")
              .slice(0, 5)
              .join(" ")}
          </Text>
          <Text>{`${userType === "staff" ? "Tenant" : "You"} scored: ${(
            Number.parseFloat(auditMetadata.score) * 100
          ).toFixed(1)}`}</Text>
        </View>
        <View>
          <AnimatedCircularProgress
            ref={animation}
            size={120}
            width={15}
            rotation={0}
            fill={progress}
            duration={1000}
            tintColor={theme["color-info-500"]}
            backgroundColor={theme["color-danger-600"]}
          >
            {() => (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {`${(
                    Number.parseFloat(auditMetadata.rectificationProgress) * 100
                  ).toFixed(1)}%`}
                </Text>
                <Text style={styles.progressText}>Progress</Text>
              </View>
            )}
          </AnimatedCircularProgress>
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
  timeStamp: {
    fontWeight: "bold",
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontWeight: "bold",
  },
});
