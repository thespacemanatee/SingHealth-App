import React from "react";
import { Platform, View } from "react-native";
import {
  Text,
  Card,
  StyleService,
  CheckBox,
  Icon,
  useTheme,
} from "@ui-kitten/components";

import { SCREEN_WIDTH } from "../../helpers/config";

const ICON_SIZE = 30;

const AlertIcon = (props) => (
  <Icon
    {...props}
    name="alert-triangle-outline"
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
  } = props;

  const theme = useTheme();

  const Header = (headerProps) => (
    <View {...headerProps} style={styles.header}>
      <Text>{index + 1}</Text>
      {!checked && !rectified && !deleted && (
        <AlertIcon fill={theme["color-danger-600"]} />
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
    >
      <View style={styles.questionContainer}>
        <CheckBox
          checked={checked}
          onChange={onChange}
          disabled={checkboxDisabled || deleted}
        />
        <View style={styles.questionTextContainer}>
          <Text
            numberOfLines={3}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: Platform.OS === "web" ? SCREEN_WIDTH - 100 : null,
              textDecorationLine: deleted ? "line-through" : null,
            }}
          >
            {question}
          </Text>
        </View>
      </View>
    </Card>
  );
};

export default CustomCard;

const styles = StyleService.create({
  questionContainer: {
    flexDirection: "row",
  },
  questionTextContainer: {
    paddingLeft: 10,
  },
  deleteBox: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    // width: 100,
  },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: ICON_SIZE * 1.5,
  },
});
