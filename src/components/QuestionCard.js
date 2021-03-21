import React, { useCallback, useState, useEffect, useRef } from "react";
import { Dimensions, Platform, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Text,
  Card,
  StyleService,
  CheckBox,
  Icon,
  useTheme,
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
  const { itemData } = props;
  const section = itemData.section.title;
  const leftSwipeable = useRef(null);

  console.log(section);

  const theme = useTheme();

  const dispatch = useDispatch();

  const SCREEN_WIDTH = Dimensions.get("window").width;

  useEffect(() => {
    setChecked(false);
    setDeleted(false);
  }, [checklistTypeStore]);

  const Header = (headerProps) => (
    <View {...headerProps}>
      <Text>{index + 1}</Text>
    </View>
  );

  const onClickDetailHandler = () => {
    props.navigation.navigate("QuestionDetails", {
      index,
      item: itemData.item,
      section,
    });
  };

  const leftComponent = useCallback(() => {
    return (
      <View
        style={[
          styles.deleteBox,
          { backgroundColor: theme["color-primary-100"] },
        ]}
      >
        <Button
          appearance="ghost"
          accessoryLeft={deleted ? UndoIcon : TrashIcon}
        />
      </View>
    );
  }, [theme, deleted]);

  const rightSwipe = useCallback(() => {
    console.log(section, index, deleted, checked);
    setDeleted(!deleted);
    // dispatch(checklistActions.changeMaximumScore(!deleted, checked));
    dispatch(checklistActions.changeAnswer(section, index, !deleted, checked));
    leftSwipeable.current.close();
  }, [section, index, deleted, checked, dispatch]);

  const onChangeHandler = useCallback(
    (nextChecked) => {
      console.log(section, index, deleted, checked);
      setChecked(nextChecked);
      // dispatch(checklistActions.changeCurrentScore(nextChecked));
      dispatch(
        checklistActions.changeAnswer(section, index, deleted, nextChecked)
      );
    },
    [section, index, deleted, checked, dispatch]
  );

  return (
    <Swipeable
      ref={leftSwipeable}
      renderLeftActions={leftComponent}
      onSwipeableOpen={rightSwipe}
      friction={2}
    >
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
                  width: Platform.OS === "web" ? SCREEN_WIDTH - 100 : null,
                  textDecorationLine: deleted ? "line-through" : null,
                }}
              >
                {itemData.item.question}
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

  /* if the props are equal, it won't update */
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
    justifyContent: "center",
    alignItems: "flex-start",
    // width: 100,
  },
});
