import React from "react";
import { useDispatch } from "react-redux";
import { Card, StyleService } from "@ui-kitten/components";
import moment from "moment";

import * as checklistActions from "../store/actions/checklistActions";
import CustomText from "./ui/CustomText";

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
    try {
      onLoading(true);
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

      navigation.navigate("Checklist", {
        auditID: now,
        stallName: item.stallName,
      });
    } catch (err) {
      console.error(err);
      onError(err);
    } finally {
      onLoading(false);
    }
  };

  return (
    <Card style={styles.item} status="basic" onPress={handleCreateNewChecklist}>
      <CustomText style={styles.stallNameText}>{item.stallName}</CustomText>
    </Card>
  );
};

export default NewChecklistCard;

const styles = StyleService.create({
  item: {
    // marginVertical: 4,
  },
  stallNameText: {
    fontFamily: "SFProDisplay-Regular",
  },
});
