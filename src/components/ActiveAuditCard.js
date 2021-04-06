import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { useTheme, StyleService } from "@ui-kitten/components";
import moment from "moment";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import ShadowCard from "./ui/ShadowCard";
import CustomText from "./ui/CustomText";

const ActiveAuditCard = ({ userType, item, onPress }) => {
  const animation = useRef(null);
  const theme = useTheme();
  const [progress, setProgress] = useState(1);
  const { auditMetadata, stallName } = item;

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
    <ShadowCard style={styles.cardContainer} onPress={handleOnPress}>
      <View>
        <CustomText bold>{stallName}</CustomText>
        <CustomText>
          {moment(auditMetadata.date.$date)
            .toLocaleString()
            .split(" ")
            .slice(0, 5)
            .join(" ")}
        </CustomText>
        <CustomText>{`${userType === "staff" ? "Tenant" : "You"} scored: ${(
          Number.parseFloat(auditMetadata.score) * 100
        ).toFixed(1)}`}</CustomText>
      </View>
      <View>
        <AnimatedCircularProgress
          ref={animation}
          size={120}
          width={10}
          rotation={0}
          lineCap="round"
          fill={progress}
          duration={1000}
          tintColor={theme["color-info-500"]}
          backgroundColor={theme["color-danger-600"]}
        >
          {() => (
            <View style={styles.progressContainer}>
              <CustomText bold>
                {`${(
                  Number.parseFloat(auditMetadata.rectificationProgress) * 100
                ).toFixed(1)}%`}
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

const styles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
