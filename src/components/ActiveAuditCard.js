import React, { useRef } from "react";
import { View } from "react-native";
import {
  useTheme,
  useStyleSheet,
  StyleService,
  Icon,
} from "@ui-kitten/components";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import ShadowCard from "./ui/ShadowCard";
import CustomText from "./ui/CustomText";

const PassIcon = (props) => (
  <Icon {...props} name="checkmark-circle-2-outline" width={20} height={20} />
);

const FailIcon = (props) => (
  <Icon {...props} name="alert-circle-outline" width={20} height={20} />
);

const ActiveAuditCard = ({
  userType,
  _id,
  stallName,
  score,
  progress,
  dateInfo,
  onPress,
}) => {
  const animation = useRef(null);
  const styles = useStyleSheet(themedStyles);

  const theme = useTheme();

  const handleOnPress = () => {
    onPress(_id, stallName);
  };

  const renderChildren = () => (
    <View style={styles.progressContainer}>
      <CustomText>{`${progress}%`}</CustomText>
      <CustomText>Progress</CustomText>
    </View>
  );

  const renderPassFailIcon = () => {
    if (Number.parseFloat(score) * 100 < 95) {
      return (
        <View style={styles.iconContainer}>
          <CustomText style={styles.failed}>FAILED</CustomText>
          <FailIcon fill="red" />
        </View>
      );
    }

    return (
      <View style={styles.iconContainer}>
        <CustomText style={styles.passed}>PASSED</CustomText>
        <PassIcon fill="green" />
      </View>
    );
  };

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
            {renderPassFailIcon()}
            <CustomText
              style={{ color: theme["color-basic-600"] }}
            >{`Time: ${dateInfo[4]}`}</CustomText>
            <CustomText style={{ color: theme["color-basic-600"] }}>{`${
              userType === "staff" ? "Tenant" : "You"
            } scored: ${(Number.parseFloat(score) * 100).toFixed(
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
          fill={progress || 1}
          duration={1000}
          tintColor={theme["color-info-400"]}
          backgroundColor={theme["color-basic-400"]}
        >
          {renderChildren}
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
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  failed: {
    color: "red",
    marginRight: 5,
  },
  passed: {
    color: "green",
    marginRight: 5,
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
