import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  Input,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";

import * as checklistActions from "../../../store/actions/checklistActions";
import ImageViewPager from "../../../components/ImageViewPager";
import CustomDatepicker from "../../../components/CustomDatePicker";
import * as authActions from "../../../store/actions/authActions";
import alert from "../../../components/CustomAlert";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const RectificationDetailsScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const { question } = route.params;
  const { section } = route.params;
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [deadline, setDeadline] = useState();
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  const dispatch = useDispatch();

  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const handleDateChange = (date) => {
    console.log(date);
    dispatch(checklistActions.changeDeadline(section, index, date));
  };

  const changeTextHandler = (val) => {
    setValue(val);
    console.log(val);
    dispatch(checklistActions.addRemarks(section, index, val));
  };

  const getImages = useCallback(async () => {
    try {
      setLoading(true);

      await dispatch(
        checklistActions.getAuditImages(
          JSON.stringify({
            fileNames:
              checklistStore.chosen_checklist.questions[section][index].image,
          }),
          index,
          section
        )
      );
    } catch (err) {
      handleErrorResponse(err);
      setLoading(false);
    }
    setLoading(false);
  }, [checklistStore.chosen_checklist, dispatch, index, section]);

  useEffect(() => {
    getImages();
  }, [getImages]);

  useEffect(() => {
    let storeImageUri;
    let storeRemarks;
    let storeDeadline;
    if (
      Object.prototype.hasOwnProperty.call(
        checklistStore.covid19.questions,
        section
      )
    ) {
      storeImageUri = checklistStore.covid19.questions[section][index].image;
      storeRemarks = checklistStore.covid19.questions[section][index].remarks;
      storeDeadline = checklistStore.covid19.questions[section][index].deadline;
    } else {
      storeImageUri =
        checklistStore.chosen_checklist.questions[section][index].image;
      storeRemarks =
        checklistStore.chosen_checklist.questions[section][index].remarks;
      storeDeadline =
        checklistStore.chosen_checklist.questions[section][index].deadline;
    }

    if (storeImageUri) {
      setImageArray(storeImageUri);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
    if (storeDeadline) {
      setDeadline(storeDeadline);
    } else {
      dispatch(
        checklistActions.changeDeadline(
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

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Rectify"
        alignment="center"
        accessoryLeft={BackAction}
      />
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
            index={index}
            section={section}
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
              onChangeText={changeTextHandler}
            />
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    </View>
  );
};

const handleErrorResponse = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data } = err.response;
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
    if (err.response.status === 403) {
      authActions.signOut();
    } else {
      switch (Math.floor(err.response.status / 100)) {
        case 4: {
          alert("Error", "Input error.");
          break;
        }
        case 5: {
          alert("Server Error", "Please contact your administrator.");
          break;
        }
        default: {
          alert("Request timeout", "Check your internet connection.");
          break;
        }
      }
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", err.message);
  }
  console.error(err.config);
};

export default RectificationDetailsScreen;

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
