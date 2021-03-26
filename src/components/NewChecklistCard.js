import React from "react";
import { useDispatch } from "react-redux";
import { Card, StyleService, Text } from "@ui-kitten/components";
import moment from "moment";

import * as checklistActions from "../store/actions/checklistActions";

const NewChecklistCard = ({ item, navigation, onError, onLoading }) => {
  const dispatch = useDispatch();

  const handleCreateNewChecklist = async () => {
    onLoading(true);
    console.log("ITEM:", item);
    try {
      await dispatch(checklistActions.getChecklist(undefined, item));

      const now = moment(new Date()).toISOString();
      onLoading(false);
      navigation.navigate("Checklist", { auditID: now });
    } catch (err) {
      console.error(err);
      onLoading(false);
      onError(err);
    }
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
