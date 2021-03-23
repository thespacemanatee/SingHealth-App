import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, StyleService, Text } from "@ui-kitten/components";

import * as checklistActions from "../store/actions/checklistActions";

const NewChecklistCard = ({ itemData, navigation }) => {
  const checklist = useSelector((state) => state.checklist);
  const dispatch = useDispatch();

  const tenantID = Object.keys(itemData.item)[0];

  const handleCreateNewChecklist = () => {
    dispatch(checklistActions.getChecklist(null, itemData.item)).then(() => {
      const now = new Date().toISOString();
      navigation.navigate("Checklist", { auditID: now });
      //   console.log(checklist);
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
    marginVertical: 4,
  },
});
