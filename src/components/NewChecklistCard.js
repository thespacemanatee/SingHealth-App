import React from "react";
import { useDispatch } from "react-redux";
import { Card, StyleService, Text } from "@ui-kitten/components";
import moment from "moment";

import * as checklistActions from "../store/actions/checklistActions";

const NewChecklistCard = ({
  item,
  navigation,
  onError,
  onLoading,
  staffID,
  institutionID,
}) => {
  const dispatch = useDispatch();

  const handleCreateNewChecklist = async () => {
    onLoading(true);
    console.log("ITEM:", item);
    try {
      await dispatch(checklistActions.getChecklist(item.fnb, item));

      const now = moment(new Date()).toISOString();

      const auditMetadata = {
        staffID,
        tenantID: item.tenantID,
        institutionID,
        date: now,
      };

      console.log("AUDITMETADATA:", auditMetadata);

      dispatch(checklistActions.createAuditMetadata(auditMetadata));

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
