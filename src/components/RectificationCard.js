import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";

import { Text, Card, StyleService, CheckBox } from "@ui-kitten/components";
import { SCREEN_WIDTH } from "../helpers/config";

const RectificationCard = (props) => {
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { index } = props;
  const { checklistType } = props;
  const { question } = props;
  const { answer } = props;
  const { section } = props;
  const { onPress } = props;

  useEffect(() => {
    if (answer === null) {
      setChecked(false);
      setDeleted(true);
    } else {
      setChecked(answer);
      setDeleted(false);
    }
  }, [answer]);

  const Header = (headerProps) => (
    <View {...headerProps}>
      <Text>{index + 1}</Text>
    </View>
  );

  const onClickDetailHandler = () => {
    onPress(checked, deleted, {
      index,
      checklistType,
      question,
      section,
    });
  };

  return (
    <Card onPress={onClickDetailHandler} header={Header}>
      <View style={styles.questionContainer}>
        <CheckBox checked={checked} disabled />
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

const areEqual = (prevProps, nextProps) => {
  /* if the props are equal, it won't update */
  const isSelectedEqual = nextProps.question === prevProps.question;

  return isSelectedEqual;
};

export default React.memo(RectificationCard, areEqual);

const styles = StyleService.create({
  questionContainer: {
    flexDirection: "row",
  },
  questionTextContainer: {
    paddingLeft: 10,
  },
});
