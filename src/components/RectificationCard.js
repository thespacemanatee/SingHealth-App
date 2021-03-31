import React, { useState, useEffect } from "react";
import CustomCard from "./ui/CustomCard";

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

  const onClickDetailHandler = () => {
    onPress(checked, deleted, {
      index,
      checklistType,
      question,
      section,
    });
  };

  return (
    <CustomCard
      index={index}
      onClick={onClickDetailHandler}
      checked={checked}
      deleted={deleted}
      checkboxDisabled
      question={question}
    />
  );
};

const areEqual = (prevProps, nextProps) => {
  /* if the props are equal, it won't update */
  const isSelectedEqual = nextProps.question === prevProps.question;

  return isSelectedEqual;
};

export default React.memo(RectificationCard, areEqual);
