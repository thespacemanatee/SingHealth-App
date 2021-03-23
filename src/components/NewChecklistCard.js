import React from "react";
import { useDispatch } from "react-redux";
import { Card, StyleService, Text } from "@ui-kitten/components";

import * as checklistActions from "../store/actions/checklistActions";

const NewChecklistCard = ({ itemData, navigation, onError, onLoading }) => {
  const dispatch = useDispatch();

  const tenantID = Object.keys(itemData.item)[0];

  const handleCreateNewChecklist = () => {
    onLoading(true);
    dispatch(checklistActions.getChecklist(null, itemData.item))
      .then(() => {
        onLoading(false);
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
      <Text>{itemData.item[tenantID].name}</Text>
    </Card>
  );
};

export default NewChecklistCard;

const styles = StyleService.create({
  item: {
    // marginVertical: 4,
  },
});
