import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  StyleService,
  Input,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";

import alert from "../../components/CustomAlert";
import * as checklistActions from "../../store/actions/checklistActions";
import CustomDatepicker from "../../components/CustomDatePicker";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import { SCREEN_HEIGHT } from "../../helpers/config";

const StaffRectificationScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const { checklistType } = route.params;
  const { question } = route.params;
  const { section } = route.params;
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [deadline, setDeadline] = useState();

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    console.log(date);
    dispatch(
      checklistActions.changeDeadline(checklistType, section, index, date)
    );
  };

  useEffect(() => {
    let storeImages;
    let storeRemarks;
    let storeDeadline;
    if (
      Object.prototype.hasOwnProperty.call(
        checklistStore.covid19.questions,
        section
      )
    ) {
      storeImages = checklistStore.covid19.questions[section][index].image;
      storeRemarks = checklistStore.covid19.questions[section][index].remarks;
      storeDeadline = checklistStore.covid19.questions[section][index].deadline;
    } else {
      storeImages =
        checklistStore.chosen_checklist.questions[section][index].image;
      storeRemarks =
        checklistStore.chosen_checklist.questions[section][index].remarks;
      storeDeadline =
        checklistStore.chosen_checklist.questions[section][index].deadline;
    }

    if (storeImages) {
      const images = storeImages.map((e) => e.uri);
      setImageArray(images);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
    if (storeDeadline) {
      setDeadline(storeDeadline);
    } else {
      dispatch(
        checklistActions.changeDeadline(
          checklistType,
          section,
          index,
          moment(
            new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() + 7
            )
          )
        )
      );
    }
  }, [checklistStore, dispatch, index, section]);

  const handleExpandImage = useCallback(
    (selectedIndex) => {
      navigation.navigate("ExpandImages", {
        imageArray,
        selectedIndex,
      });
    },
    [imageArray, navigation]
  );

  const renderListItems = useCallback(
    (itemData) => {
      return (
        <ImagePage
          imageUri={itemData.item}
          index={index}
          section={section}
          selectedIndex={itemData.index}
          onPress={() => handleExpandImage(itemData.index)}
        />
      );
    },
    [handleExpandImage, index, section]
  );

  return (
    <View style={styles.screen}>
      <TopNavigation title="Details" alignment="center" />
      <Divider />
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: theme["color-primary-400"] },
        ]}
      >
        <Text style={styles.text}>{question}</Text>
      </View>
      <Layout style={styles.layout}>
        <KeyboardAwareScrollView extraHeight={200}>
          <ImageViewPager
            imageArray={imageArray}
            renderListItems={renderListItems}
          />
          <View style={styles.datePickerContainer}>
            <Text category="h6">Deadline: </Text>
            <CustomDatepicker onSelect={handleDateChange} deadline={deadline} />
          </View>
          <View style={styles.inputContainer}>
            <Text category="h6">Remarks: </Text>
            <Input
              height={SCREEN_HEIGHT * 0.1}
              multiline
              textStyle={styles.input}
              placeholder="Enter your remarks here"
              value={value}
              disabled
            />
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    </View>
  );
};

export default StaffRectificationScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 25,
  },
  text: {
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    // margin: 20,
  },
  input: {
    minHeight: 64,
  },
});
