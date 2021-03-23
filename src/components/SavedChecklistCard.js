import React, { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import { Text, View } from "react-native";
import {
  Card,
  StyleService,
  Button,
  useTheme,
  Icon,
} from "@ui-kitten/components";
import Swipeable from "react-native-gesture-handler/Swipeable";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as checklistActions from "../store/actions/checklistActions";

const TrashIcon = (props) => <Icon {...props} name="trash" />;

const SavedChecklistCard = ({ itemData, navigation, deleteSave }) => {
  const leftSwipeable = useRef(null);
  const dispatch = useDispatch();

  const theme = useTheme();

  const tenantID = Object.keys(itemData.item.data.chosen_tenant)[0];
  console.log(itemData.item.time);

  const rightSwipe = useCallback(async () => {
    let data = await AsyncStorage.getItem("savedChecklists");
    if (data !== null) {
      data = JSON.parse(data);
    }
    delete data[itemData.item.time];
    console.log(data);
    AsyncStorage.setItem("savedChecklists", JSON.stringify(data));
    leftSwipeable.current.close();
    deleteSave();
  }, [deleteSave, itemData.item.time]);

  const leftComponent = useCallback(() => {
    return (
      <View
        style={[
          styles.deleteBox,
          { backgroundColor: theme["color-primary-100"] },
        ]}
      >
        <Button appearance="ghost" accessoryLeft={TrashIcon} />
      </View>
    );
  }, [theme]);

  return (
    <Swipeable
      ref={leftSwipeable}
      renderLeftActions={leftComponent}
      onSwipeableOpen={rightSwipe}
      friction={2}
    >
      <Card
        style={styles.item}
        status="basic"
        onPress={() => {
          dispatch(checklistActions.addSavedChecklist(itemData.item.data));
          navigation.navigate("Checklist", {
            auditID: itemData.item.time,
            savedChecklist: itemData.item.data,
          });
        }}
      >
        <View>
          <Text>{itemData.item.data.chosen_tenant[tenantID].name}</Text>
          <Text>{itemData.item.time}</Text>
        </View>
      </Card>
    </Swipeable>
  );
};

export default SavedChecklistCard;

const styles = StyleService.create({
  item: {
    marginVertical: 4,
  },
  deleteBox: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    // width: 100,
  },
});
