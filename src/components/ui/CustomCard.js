import React from "react";
import { View } from "react-native";
import {
  Card,
  StyleService,
  CheckBox,
  Icon,
  useTheme,
} from "@ui-kitten/components";
import moment from "moment";

import CustomText from "./CustomText";

const ICON_SIZE = 30;

const AlertIcon = (props) => (
  <Icon
    {...props}
    name="alert-circle-outline"
    style={{
      width: ICON_SIZE,
      height: ICON_SIZE,
    }}
  />
);

const CheckIcon = (props) => (
  <Icon
    {...props}
    name="checkmark-circle-2-outline"
    style={{
      width: ICON_SIZE,
      height: ICON_SIZE,
    }}
  />
);

const CustomCard = (props) => {
  const {
    index,
    onChange,
    onClick,
    checked,
    deleted,
    question,
    rectified,
    checkboxDisabled,
    deadline,
  } = props;

  const theme = useTheme();

  const Header = (headerProps) => (
    <View {...headerProps} style={styles.header}>
      <CustomText style={styles.font}>{index + 1}</CustomText>
      {!checked && rectified === false && !deleted && (
        <View style={styles.unrectifiedContainer}>
          <CustomText style={styles.deadline}>
            {`Deadline: ${moment(deadline?.$date || deadline)
              .toLocaleString()
              .split(" ")
              .slice(0, 4)
              .join(" ")}`}
          </CustomText>
          <AlertIcon fill={theme["color-danger-600"]} />
        </View>
      )}
      {!checked && rectified && <CheckIcon fill={theme["color-success-600"]} />}
    </View>
  );

  return (
    <Card
      header={Header}
      onPress={onClick}
      status={
        // eslint-disable-next-line no-nested-ternary
        deleted ? "warning" : !checked && !rectified ? "danger" : "success"
      }
      style={styles.card}
    >
      <View style={styles.questionContainer}>
        <CheckBox
          checked={checked}
          onChange={onChange}
          disabled={checkboxDisabled || deleted}
        />
        <View style={styles.questionTextContainer}>
          <CustomText
            numberOfLines={2}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              textDecorationLine: deleted ? "line-through" : null,
              fontFamily: "SFProDisplay-Regular",
            }}
          >
            {question}
          </CustomText>
        </View>
      </View>
    </Card>
  );
};

export default CustomCard;

const styles = StyleService.create({
  card: {
    height: 120,
  },
  font: {
    fontFamily: "SFProDisplay-Regular",
  },
  unrectifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  deadline: {
    marginHorizontal: 5,
  },
  questionContainer: {
    flexDirection: "row",
  },
  questionTextContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  deleteBox: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: ICON_SIZE * 1.5,
  },
});
