import React from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import * as checklistActions from "../store/actions/checklistActions";
import EntityCard from "./EntityCard";
import { handleErrorResponse } from "../helpers/utils";

const NewChecklistCard = ({
  item,
  navigation,
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

      dispatch(checklistActions.createAuditMetadata(auditMetadata));

      navigation.navigate("Checklist", {
        auditID: now,
        stallName: item.stallName,
      });
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      onLoading(false);
    }
  };

  return (
    <EntityCard
      onPress={handleCreateNewChecklist}
      displayName={item.stallName}
      image={item.image}
    />
  );
};

export default NewChecklistCard;
