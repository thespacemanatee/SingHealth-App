import React from "react";
import { Platform, View } from "react-native";
import { Text, Card, StyleService, CheckBox } from "@ui-kitten/components";

import { SCREEN_WIDTH } from "../../helpers/config";

const CustomCard = (props) => {
  const { index } = props;
  const { onChange } = props;
  const { onClick } = props;
  const { checked } = props;
  const { deleted } = props;
  const { question } = props;
  const { rectified } = props;
  const { checkboxDisabled } = props;

  const Header = (headerProps) => (
    <View {...headerProps}>
      <Text>{index + 1}</Text>
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
});