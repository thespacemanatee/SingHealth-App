import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  Input,
  useTheme,
} from "@ui-kitten/components";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";

import alert from "../../components/CustomAlert";
import * as checklistActions from "../../store/actions/checklistActions";
import CustomDatepicker from "../../components/CustomDatePicker";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import CustomText from "../../components/ui/CustomText";
import { saveDestination } from "../../helpers/utils";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [deadline, setDeadline] = useState();
  const [min] = useState(new Date());
  const [max] = useState(
    moment(new Date(min.getFullYear(), min.getMonth(), min.getDate() + 31))
  );

  const { index, checklistType, question, section } = route.params;

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    dispatch(
      checklistActions.changeDeadline(checklistType, section, index, date)
    );
  };

  const changeTextHandler = (val) => {
    setValue(val);
  };

  const onBlurHandler = () => {
    dispatch(checklistActions.addRemarks(checklistType, section, index, value));
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
  }, [checklistStore, checklistType, dispatch, index, max, section]);

  const onSave = async (imageData) => {
    if (imageArray.length > 2) {
      alert("Upload Failed", "Max upload count is 3.", [{ text: "OK" }]);
    } else {
      const { fileName, destination } = await saveDestination(
        checklistStore.chosen_tenant.tenantID,
        imageData
      );
      dispatch(
        checklistActions.addImage(
          checklistType,
          section,
          index,
          fileName,
          destination
        )
      );
    }
  };

  const startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      navigation.navigate("CameraModal", { onSave });
    } else {
      Alert.alert("Access denied");
    }
  };

  const imagePickerHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
    });

    if (!result.cancelled) {
      onSave(result);
    }
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          window.history.back();
        } else {
          navigation.goBack();
        }
      }}
    />
  );

  const CameraAction = () => (
    <TopNavigationAction
      icon={CameraIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          navigation.navigate("CameraModal", { onSave });
        } else {
          startCamera();
        }
      }}
    />
  );

  const ImageAction = () => (
    <TopNavigationAction
      icon={ImageIcon}
      onPress={() => {
        imagePickerHandler();
      }}
    />
  );

  const renderRightActions = () => {
    return (
      <>
        <CameraAction />
        <ImageAction />
      </>
    );
  };

  const handleExpandImage = useCallback(
    (selectedIndex) => {
      navigation.navigate("ExpandImages", {
        imageArray,
        selectedIndex,
      });
    },
    [imageArray, navigation]
  );

  const handleDeleteImage = useCallback(
    (selectedIndex) => {
      alert("Delete Image", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch(
              checklistActions.deleteImage(
                checklistType,
                section,
                index,
                selectedIndex
              )
            );
          },
        },
      ]);
    },
    [checklistType, dispatch, index, section]
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
          onDelete={handleDeleteImage}
        />
      );
    },
    [handleDeleteImage, handleExpandImage, index, section]
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Details"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: theme["color-primary-400"] },
        ]}
      >
        <CustomText bold>{question}</CustomText>
      </View>
      <Layout style={styles.layout}>
        <KeyboardAwareScrollView extraHeight={200}>
          <ImageViewPager
            imageArray={imageArray}
            renderListItems={renderListItems}
          />
          <View style={styles.datePickerContainer}>
            <CustomText bold>Deadline: </CustomText>
            <CustomDatepicker
              onSelect={handleDateChange}
              deadline={deadline}
              min={min}
              max={max}
            />
          </View>
          <View style={styles.inputContainer}>
            <CustomText bold>Remarks: </CustomText>
            <Input
              multiline
              textStyle={styles.input}
              placeholder="Enter your remarks here"
              value={value}
              onChangeText={changeTextHandler}
              onBlur={onBlurHandler}
            />
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    </View>
  );
};

export default QuestionDetailsScreen;

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
  datePickerContainer: {
    marginTop: 20,
  },
  input: {
    minHeight: 64,
  },
});
