import React, { useCallback, useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { StyleService, Icon, useTheme } from "@ui-kitten/components";
import Swipeable from "react-native-gesture-handler/Swipeable";

import * as checklistActions from "../store/actions/checklistActions";
import CustomCard from "./ui/CustomCard";

const ICON_SIZE = 30;

const QuestionCard = (props) => {
  const [checked, setChecked] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const { index, checklistType, question, answer, section, onPress } = props;

  const leftSwipeable = useRef(null);

  const theme = useTheme();

  const dispatch = useDispatch();

  const TrashIcon = useCallback(
    (iconProps) => (
      <Icon
        {...iconProps}
        name="trash"
        fill={theme["color-primary-500"]}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
      />
    ),
    [theme]
  );
  const UndoIcon = useCallback(
    (iconProps) => (
      <Icon
        {...iconProps}
        name="undo"
        fill={theme["color-primary-500"]}
        style={{
          width: ICON_SIZE,
          height: ICON_SIZE,
        }}
      />
    ),
    [theme]
  );

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
        {deleted ? <UndoIcon /> : <TrashIcon />}
      </View>
    );
  }, [TrashIcon, UndoIcon, deleted, theme]);

  const rightSwipe = useCallback(() => {
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
    [checklistType, section, index, deleted, dispatch]
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
    alignItems: "center",
    width: ICON_SIZE * 3,
  },
});
