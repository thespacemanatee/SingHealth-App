import React, { useCallback, useState, useEffect } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Text,
  Card,
  StyleService,
  CheckBox,
  Icon,
} from "@ui-kitten/components";
import Swipeable from "react-native-gesture-handler/Swipeable";

import * as checklistActions from "../store/actions/checklistActions";

const TrashIcon = (props) => <Icon {...props} name="trash" />;
const UndoIcon = (props) => <Icon {...props} name="undo" />;

const QuestionCard = (props) => {
  const checklistTypeStore = useSelector(
    (state) => state.checklist.chosen_checklist_type
  );
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { index } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    setChecked(false);
    setDeleted(false);
  }, [checklistTypeStore]);

  const Header = (props) => (
    <View {...props}>
      <Text>{index + 1}</Text>
    </View>
  );

  const onClickDetailHandler = () => {
    props.navigation.navigate("QuestionDetails", {
      index: index,
    });
  };

  const rightSwipe = useCallback(
    (progress, dragX) => {
      return (
        <View style={styles.deleteBox}>
          <Button
            appearance="ghost"
            accessoryLeft={deleted ? UndoIcon : TrashIcon}
            onPress={() => {
              setDeleted(!deleted);
              dispatch(checklistActions.changeMaximumScore(deleted, checked));
            }}
          />
        </View>
      );
    },
    [deleted, checked]
  );

  const onChangeHandler = useCallback((nextChecked) => {
    setChecked(nextChecked);
    dispatch(checklistActions.changeCurrentScore(nextChecked));
  }, []);

  return (
    <Swipeable renderLeftActions={rightSwipe} overshootLeft={false}>
      <View>
        <Card onPress={onClickDetailHandler} header={Header}>
          <View style={styles.questionContainer}>
            <CheckBox
              checked={checked}
              onChange={onChangeHandler}
              disabled={deleted}
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
  const { itemData } = nextProps;
  const { itemData: prevItemData } = prevProps;

  /*if the props are equal, it won't update*/
  const isSelectedEqual = itemData.item.question === prevItemData.item.question;

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
