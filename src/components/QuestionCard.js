import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Text,
  Card,
  StyleService,
  CheckBox,
  Icon,
} from "@ui-kitten/components";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Extrapolate } from "react-native-reanimated";

const TrashIcon = (props) => <Icon {...props} name="trash" />;
const UndoIcon = (props) => <Icon {...props} name="undo" />;
const CameraIcon = (props) => <Icon {...props} name="camera" />;

const QuestionCard = (props) => {
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const rightSwipe = (progress, dragX) => {
    // const scale = dragX.interpolate({
    //   inputRange: [0, 100],
    //   outputRange: [0, 1],
    //   extrapolate: Extrapolate.CLAMP,
    // });
    return (
      <View style={styles.deleteBox}>
        <Button
          appearance="ghost"
          accessoryLeft={deleted ? UndoIcon : TrashIcon}
          onPress={() => {
            setDeleted(!deleted);
          }}
        />
      </View>
    );
  };

  const leftSwipe = (progress, dragX) => {
    return (
      <View style={styles.deleteBox}>
        <Button
          appearance="ghost"
          accessoryLeft={CameraIcon}
          onPress={() => {}}
        />
      </View>
    );
  };

  return (
    <Swipeable
      renderLeftActions={rightSwipe}
      renderRightActions={deleted ? undefined : leftSwipe}
    >
      <View>
        <Card>
          <View style={styles.questionContainer}>
            <CheckBox
              checked={checked}
              onChange={(nextChecked) => setChecked(nextChecked)}
              disabled={deleted ? true : false}
            />
            <View style={styles.questionTextContainer}>
              <Text
                style={{
                  textDecorationLine: deleted ? "line-through" : null,
                }}
              >
                {props.itemData.item.question}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </Swipeable>
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
  deleteBox: {
    // flex: 1,
    backgroundColor: "#FEE8D1",
    justifyContent: "center",
    alignItems: "center",
    // width: 100,
  },
});
