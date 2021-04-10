import React from "react";
import { View, Platform } from "react-native";
import Animated, { useDerivedValue } from "react-native-reanimated";
import { ReText, round } from "react-native-redash";
import { StyleService, useStyleSheet } from "@ui-kitten/components";

import StyleGuide from "../../StyleGuide";
import CustomText from "../CustomText";

export const LABEL_SIZE = 150;

const themedStyles = StyleService.create({
  date: {
    ...StyleGuide.typography.body,
    textAlign: Platform.OS !== "web" ? "right" : null,
    // backgroundColor: "red",
  },
  score: {
    ...StyleGuide.typography.body,
    textAlign: Platform.OS !== "web" ? "right" : null,
    // backgroundColor: "red",
  },
  labelContainer: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: LABEL_SIZE,
    padding: 10,
    borderRadius: 3,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: "color-primary-400",
  },
  averageText: {
    fontSize: 16,
    lineHeight: 25,
  },
  dateContainer: {
    flex: 0.5,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 0.5,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});

export interface DataPoint {
  coord: {
    x: number;
    y: number;
  };
  data: {
    x: number;
    y: number;
  };
}

interface LabelProps {
  point: Animated.SharedValue<DataPoint>;
}

const Label = ({ point }: LabelProps) => {
  const styles = useStyleSheet(themedStyles);

  const date = useDerivedValue(() => {
    const d = new Date(point.value.data.x);
    return d.toDateString().split(" ").slice(1, 3).join(" ");
  });
  const year = useDerivedValue(() => {
    return new Date(point.value.data.x).getFullYear().toString();
    // return d.toDateString().replace(/^\S+\s/, "");
  });
  const points = useDerivedValue(() => {
    const p = point.value.data.y;
    return `${round(p, 1)}`;
  });
  return (
    <View style={styles.labelContainer}>
      <View style={styles.contentContainer}>
        <CustomText style={styles.averageText} bold={false}>
          Average
        </CustomText>
        <ReText style={styles.score} text={points} />
      </View>
      <View style={styles.dateContainer}>
        <ReText style={styles.date} text={date} />
        <ReText style={styles.date} text={year} />
      </View>
    </View>
  );
};

export default Label;
