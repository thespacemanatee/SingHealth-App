import React, { useState, useEffect, useCallback } from "react";
import { View, Dimensions, Platform, FlatList } from "react-native";
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
import CustomDatepicker from "../../../components/CustomDatePicker";
import * as authActions from "../../../store/actions/authActions";
import ImagePage from "../../../components/ui/ImagePage";
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
  const [error, setError] = useState(false);

  const { width, height } = Dimensions.get("window");
  const IMAGE_HEIGHT = height * 0.5;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    console.log(date);
    dispatch(checklistActions.changeDeadline(section, index, date));
  };

  const changeTextHandler = (val) => {
    setValue(val);
    console.log(val);
    dispatch(checklistActions.addRemarks(section, index, val));
  };

  const getImages = async () => {
    try {
      setLoading(true);

      if (checklistStore.chosen_checklist.questions[section][index].image) {
        setLoading(true);
        try {
          await Promise.all(
            checklistStore.chosen_checklist.questions[section][index].image.map(
              async (fileName) => {
                if (!fileName.name) {
                  const res = await dispatch(
                    checklistActions.getImage(fileName)
                  );
                  dispatch(
                    checklistActions.addImage(
                      section,
                      index,
                      fileName,
                      `data:image/jpg;base64,${res.data}`
                    )
                  );
                }
              }
            )
          );
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
          handleErrorResponse(err);
        }
      }
      // setImageArray(temp);
      setLoading(false);
    } catch (err) {
      handleErrorResponse(err);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("USEEFFECT");
    getImages();
  }, []);

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
      console.log("AFTER GET IMAGES:", storeImages);
      setImageArray(images);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
    if (storeDeadline) {
      setDeadline(storeDeadline);
    } else {
      const newDate = moment(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 7
        )
      );
      dispatch(checklistActions.changeDeadline(section, index, newDate));
      setDeadline(newDate);
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
          rectify
        />
      );
    },
    [handleExpandImage, index, section]
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
          {imageArray.length > 0 ? (
            <View style={{ width }}>
              <FlatList
                horizontal
                snapToInterval={IMAGE_WIDTH + 20}
                contentContainerStyle={[
                  styles.contentContainer,
                  { paddingRight: width - IMAGE_WIDTH - 20 * 3 },
                ]}
                decelerationRate="fast"
                keyExtractor={(item) => item}
                data={imageArray}
                renderItem={renderListItems}
                showsHorizontalScrollIndicator={Platform.OS === "web"}
              />
            </View>
          ) : (
            <ImagePage loading />
          )}
          <View style={styles.datePickerContainer}>
            <Text category="h6">Deadline: </Text>
            <CustomDatepicker onSelect={handleDateChange} deadline={deadline} />
          </View>
          <View style={styles.inputContainer}>
            <Text category="h6">Remarks: </Text>
            <Input
              height={height * 0.1}
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
