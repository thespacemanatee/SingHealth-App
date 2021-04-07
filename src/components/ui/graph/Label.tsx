import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import Animated, { useDerivedValue } from "react-native-reanimated";
import { ReText, round } from "react-native-redash";
import { Card } from "@ui-kitten/components";

import StyleGuide from "../../StyleGuide";
import CustomText from "../CustomText";

const styles = StyleSheet.create({
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
    flex: 1,
    width: 150,
    // backgroundColor: "red",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contentContainer: {
    flexDirection: "row",
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
  const date = useDerivedValue(() => {
    const d = new Date(point.value.data.x);
    return d.toDateString().replace(/^\S+\s/, "");
  });
  const points = useDerivedValue(() => {
    const p = point.value.data.y;
    return `${round(p, 1)}`;
  });
  return (
    <Card>
      <View style={styles.labelContainer}>
        <View style={styles.dateContainer}>
          <CustomText>Date: </CustomText>
          <ReText style={styles.date} text={date} />
        </View>
        <View style={styles.contentContainer}>
          <CustomText>Average: </CustomText>
          <ReText style={styles.score} text={points} />
        </View>
      </View>
    </Card>
  );
};

export default Label;
