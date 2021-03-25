import React from "react";
import { useDispatch } from "react-redux";
import { Card, StyleService, Text } from "@ui-kitten/components";

import * as checklistActions from "../store/actions/checklistActions";

const NewChecklistCard = ({ item, navigation, onError, onLoading }) => {
  const dispatch = useDispatch();

  const handleCreateNewChecklist = () => {
    onLoading(true);
    console.log("ITEM:", item);
    dispatch(checklistActions.getChecklist(undefined, item))
      .then(() => {
        // onLoading(false);
        const now = new Date().toISOString();
        navigation.navigate("Checklist", { auditID: now });
      })
      .catch((err) => {
        console.error(err);
        onLoading(false);
        onError(err, handleCreateNewChecklist);
      });
  };

  return (
    <Card style={styles.item} status="basic" onPress={handleCreateNewChecklist}>
      <Text>{item.stallName}</Text>
    </Card>
  );
};

export default NewChecklistCard;

const styles = StyleService.create({
  item: {
    // marginVertical: 4,
  },
});
