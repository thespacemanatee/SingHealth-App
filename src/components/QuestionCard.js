import React, { useCallback, useState } from "react";
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
  console.log("Re-rendered questioncard " + props.index);
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const onClickDetailHandler = () => {
    props.navigation.navigate("QuestionDetails", {
      index: props.index,
    });
  };

  const rightSwipe = useCallback((progress, dragX) => {
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
  }, []);

  return (
    <Swipeable
      renderLeftActions={rightSwipe}
      overshootLeft={false}
    >
      <View>
        <Card onPress={onClickDetailHandler}>
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

const areEqual = (prevProps, nextProps) => {
  const { isSelected } = nextProps;
  const { isSelected: prevIsSelected } = prevProps;
  
  /*if the props are equal, it won't update*/
  const isSelectedEqual = isSelected === prevIsSelected;

  return isSelectedEqual;
};


export default React.memo(QuestionCard, areEqual);

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
