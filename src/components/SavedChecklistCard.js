import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { View } from "react-native";
import { StyleService } from "@ui-kitten/components";
import moment from "moment";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as checklistActions from "../store/actions/checklistActions";
import alert from "./CustomAlert";
import CustomText from "./ui/CustomText";
import ShadowCard from "./ui/ShadowCard";

const SavedChecklistCard = ({
  item,
  navigation,
  deleteSave,
  onError,
  onLoading,
}) => {
  const dispatch = useDispatch();

  const handleOpenSavedChecklist = () => {
    dispatch(checklistActions.addSavedChecklist(item.data));
    navigation.navigate("Checklist", {
      auditID: item.time,
      stallName: item.chosen_tenant.stallName,
    });
  };

  const deleteSaved = useCallback(async () => {
    try {
      onLoading(true);
      let data = await AsyncStorage.getItem("savedChecklists");
      if (data !== null) {
        data = JSON.parse(data);
      }
      delete data[item.time];
      AsyncStorage.setItem("savedChecklists", JSON.stringify(data));

      await deleteSave();
    } catch (err) {
      onError(err);
    } finally {
      onLoading(false);
    }
  }, [deleteSave, item.time, onError, onLoading]);

  const longPressHandler = useCallback(async () => {
    alert("Delete checklist", "Are you sure you want to delete this forever?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      { text: "Confirm", style: "destructive", onPress: deleteSaved },
    ]);
  }, [deleteSaved]);

  return (
    <ShadowCard
      style={styles.cardContainer}
      status="info"
      activeOpacity={0.5}
      onPress={handleOpenSavedChecklist}
      onLongPress={longPressHandler}
    >
      <View>
        <CustomText style={styles.stallNameText}>
          {item.data.chosen_tenant.stallName}
        </CustomText>
        <CustomText style={styles.stallNameText}>
          {moment(item.time).toLocaleString().split(" ").slice(0, 5).join(" ")}
        </CustomText>
      </View>
    </ShadowCard>
  );
};

export default SavedChecklistCard;

const styles = StyleService.create({
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  deleteBox: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    // width: 100,
  },
  stallNameText: {
    fontFamily: "SFProDisplay-Regular",
  },
});
