import React, { useState } from "react";
import { View } from "react-native";
import { Text, Card, StyleService, CheckBox } from "@ui-kitten/components";

const QuestionCard = (props) => {
  const [checked, setChecked] = useState(false);
  return (
    <Card>
      <View style={styles.questionContainer}>
        <CheckBox
          checked={checked}
          onChange={(nextChecked) => setChecked(nextChecked)}
        />
        <View style={styles.questionTextContainer}>
          <Text>{props.itemData.item.question}</Text>
        </View>
      </View>
    </Card>
  );
};

export default QuestionCard;

const styles = StyleService.create({
  questionContainer: {
    flexDirection: "row",
  },
  questionTextContainer: {
    paddingLeft: 10,
  },
});
