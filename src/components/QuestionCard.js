import React, { useCallback, useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, StyleService, Icon, useTheme } from "@ui-kitten/components";
import Swipeable from "react-native-gesture-handler/Swipeable";

import * as checklistActions from "../store/actions/checklistActions";
import CustomCard from "./ui/CustomCard";

const TrashIcon = (props) => <Icon {...props} name="trash" />;
const UndoIcon = (props) => <Icon {...props} name="undo" />;

const QuestionCard = (props) => {
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { index } = props;
  const { checklistType } = props;
  const { question } = props;
  const { answer } = props;
  const { section } = props;
  const { onPress } = props;

  const leftSwipeable = useRef(null);

  const theme = useTheme();

  const dispatch = useDispatch();

  useEffect(() => {
    if (answer === null) {
      setChecked(false);
      setDeleted(true);
    } else {
      setChecked(answer);
      setDeleted(false);
    }
  }, [answer]);

  const onClickDetailHandler = () => {
    onPress(checked, deleted, {
      index,
      checklistType,
      section,
      question,
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
    console.log(checklistType, section, index, deleted, checked);
    setDeleted(!deleted);
    // dispatch(checklistActions.changeMaximumScore(!deleted, checked));
    dispatch(
      checklistActions.changeAnswer(
        checklistType,
        section,
        index,
        !deleted,
        checked
      )
    );
    leftSwipeable.current.close();
  }, [checklistType, section, index, deleted, checked, dispatch]);

  const onChangeHandler = useCallback(
    (nextChecked) => {
      console.log(checklistType, section, index, deleted, checked);
      setChecked(nextChecked);
      // dispatch(checklistActions.changeCurrentScore(nextChecked));
      dispatch(
        checklistActions.changeAnswer(
          checklistType,
          section,
          index,
          deleted,
          nextChecked
        )
      );
    },
    [checklistType, section, index, deleted, checked, dispatch]
  );

  return (
    <Swipeable
      ref={leftSwipeable}
      renderLeftActions={leftComponent}
      onSwipeableOpen={rightSwipe}
      friction={2}
    >
      <CustomCard
        index={index}
        onClick={onClickDetailHandler}
        onChange={onChangeHandler}
        checked={checked}
        deleted={deleted}
        question={question}
      />
    </Swipeable>
  );
};

// const areEqual = (prevProps, nextProps) => {
//   /* if the props are equal, it won't update */
//   const isSelectedEqual = nextProps.question === prevProps.question;

//   return isSelectedEqual;
// };

export default React.memo(QuestionCard);

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
