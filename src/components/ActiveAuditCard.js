import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useTheme, useStyleSheet, StyleService } from "@ui-kitten/components";
import moment from "moment";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import ShadowCard from "./ui/ShadowCard";
import CustomText from "./ui/CustomText";

const ActiveAuditCard = ({ userType, item, onPress }) => {
  const animation = useRef(null);
  const styles = useStyleSheet(themedStyles);
  const [progress, setProgress] = useState(1);
  const { auditMetadata, stallName } = item;
  const [dateInfo] = useState(
    moment(auditMetadata.date.$date).toLocaleString().split(" ").slice(0, 5)
  );

  const theme = useTheme();

  const handleOnPress = () => {
    onPress(auditMetadata._id, stallName);
  };

  useEffect(() => {
    const temp = Number.parseFloat(
      (Number.parseFloat(auditMetadata.rectificationProgress) * 100).toFixed(1)
    );
    if (auditMetadata.rectificationProgress === undefined) {
      setProgress(100);
    } else if (temp > 0) {
      setProgress(temp);
    }
  }, [auditMetadata.rectificationProgress]);

  return (
    <ShadowCard style={styles.cardContainer} onPress={handleOnPress}>
      <View style={styles.dateContainer}>
        <CustomText style={styles.day}>{dateInfo[2]}</CustomText>
        <CustomText style={styles.month}>
          {dateInfo[1].toUpperCase()}
        </CustomText>
      </View>
      <View style={styles.divider} />
      <View style={styles.infoContainer}>
        <View style={styles.infoText}>
          <CustomText style={{ color: theme["color-primary-500"] }}>
            {stallName}
          </CustomText>
          <View>
            <CustomText
              style={{ color: theme["color-basic-600"] }}
            >{`Time: ${dateInfo[4]}`}</CustomText>
            <CustomText style={{ color: theme["color-basic-600"] }}>{`${
              userType === "staff" ? "Tenant" : "You"
            } scored: ${(Number.parseFloat(auditMetadata.score) * 100).toFixed(
              1
            )}`}</CustomText>
          </View>
        </View>
        <AnimatedCircularProgress
          ref={animation}
          size={120}
          width={10}
          rotation={0}
          lineCap="round"
          fill={progress}
          duration={1000}
          tintColor={theme["color-info-400"]}
          backgroundColor={theme["color-basic-400"]}
        >
          {() => (
            <View style={styles.progressContainer}>
              <CustomText>
                {`${
                  auditMetadata.rectificationProgress !== undefined
                    ? (
                        Number.parseFloat(auditMetadata.rectificationProgress) *
                        100
                      ).toFixed(1)
                    : 100
                }%`}
              </CustomText>
              <CustomText>Progress</CustomText>
            </View>
          )}
        </AnimatedCircularProgress>
      </View>
    </ShadowCard>
  );
};

export default ActiveAuditCard;

const themedStyles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  divider: {
    height: 100,
    width: 1,
    backgroundColor: "color-basic-400",
  },
  dateContainer: {
    flex: 0.2,
    flexDirection: "column",
    alignItems: "center",
  },
  day: {
    color: "color-primary-400",
    fontSize: 20,
  },
  month: {
    color: "color-primary-400",
    fontSize: 14,
  },
  infoContainer: {
    flex: 0.8,
    flexDirection: "row",
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  infoText: {
    flex: 0.9,
    justifyContent: "space-between",
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
