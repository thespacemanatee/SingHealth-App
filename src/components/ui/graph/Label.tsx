import React from "react";
import { View } from "react-native";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ReText, round } from "react-native-redash";
import { StyleService, useStyleSheet } from "@ui-kitten/components";

import StyleGuide from "../../StyleGuide";

export const LABEL_SIZE = 150;

const themedStyles = StyleService.create({
  date: {
    ...StyleGuide.typography.body,
    textAlign: "right",
  },
  score: {
    ...StyleGuide.typography.body,
    textAlign: "left",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: LABEL_SIZE,
    padding: 10,
    borderRadius: 5,
    opacity: 0.8,
    borderWidth: 1,
    borderColor: "color-primary-400",
  },

  dateContainer: {
    flex: 0.5,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 0.5,
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
  const averageText = useSharedValue("Average");

  const date = useDerivedValue(() => {
    const d = new Date(point.value.data.x);
    return d.toDateString().split(" ").slice(1, 3).join(" ");
  });
  const year = useDerivedValue(() => {
    return new Date(point.value.data.x).getFullYear().toString();
  });
  const points = useDerivedValue(() => {
    const p = point.value.data.y;
    return `${round(p, 1)}`;
  });
  return (
    <View style={styles.labelContainer}>
      <View style={styles.contentContainer}>
        <ReText style={styles.score} text={averageText} />
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
