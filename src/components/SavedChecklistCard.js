import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as checklistActions from "../store/actions/checklistActions";
import alert from "./CustomAlert";
import EntityCard from "./EntityCard";
import { handleErrorResponse } from "../helpers/utils";

const SavedChecklistCard = ({ item, navigation, deleteSave, onLoading }) => {
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
      handleErrorResponse(err);
    } finally {
      onLoading(false);
    }
  }, [deleteSave, item.time, onLoading]);

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
    <EntityCard
      onPress={handleOpenSavedChecklist}
      onLongPress={longPressHandler}
      displayName={item.data.chosen_tenant.stallName}
      timestamp={moment(item.time)
        .toLocaleString()
        .split(" ")
        .slice(0, 5)
        .join(" ")}
      image={item.image}
    />
  );
};

export default SavedChecklistCard;
