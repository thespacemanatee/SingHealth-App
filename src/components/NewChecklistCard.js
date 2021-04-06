import React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { StyleService } from "@ui-kitten/components";
import moment from "moment";

import * as checklistActions from "../store/actions/checklistActions";
import CustomText from "./ui/CustomText";
import ShadowCard from "./ui/ShadowCard";

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
    <ShadowCard
      style={styles.cardContainer}
      status="info"
      activeOpacity={0.5}
      onPress={handleCreateNewChecklist}
    >
      <View>
        <CustomText style={styles.stallNameText}>{item.stallName}</CustomText>
      </View>
    </ShadowCard>
  );
};

export default NewChecklistCard;

const styles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  item: {
    // marginVertical: 4,
  },
  stallNameText: {
    fontFamily: "SFProDisplay-Regular",
  },
});
