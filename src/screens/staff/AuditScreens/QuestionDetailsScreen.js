import React, { useState, useEffect } from "react";
import { View, Alert, Platform, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  ViewPager,
  Input,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import alert from "../../../components/CustomAlert";
import * as checklistActions from "../../../store/actions/checklistActions";
import ImageViewPager from "../../../components/ImageViewPager";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const { item } = route.params;
  const { section } = route.params;
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);

  const theme = useTheme();

  const dispatch = useDispatch();

  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const changeTextHandler = (val) => {
    setValue(val);
    console.log(val);
    dispatch(checklistActions.addRemarks(section, index, val));
  };

  useEffect(() => {
    let storeImageUri;
    let storeRemarks;
    if (
      Object.prototype.hasOwnProperty.call(
        checklistStore.covid19.questions,
        section
      )
    ) {
      storeImageUri = checklistStore.covid19.questions[section][index].image;
      storeRemarks = checklistStore.covid19.questions[section][index].remarks;
    } else {
      storeImageUri =
        checklistStore.chosen_checklist.questions[section][index].image;
      storeRemarks =
        checklistStore.chosen_checklist.questions[section][index].remarks;
    }
    if (storeImageUri) {
      setImageArray(storeImageUri);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
  }, [checklistStore, index, section]);

  const onSave = async (imageData) => {
    if (imageArray.length > 2) {
      alert("Upload Failed", "Max upload count is 3.", [{ text: "OK" }]);
    } else {
      const fileName =
        checklistStore.chosen_tenant[
          Object.keys(checklistStore.chosen_tenant)[0]
        ].name + Date.now();
      let destination;
      if (Platform.OS === "web") {
        destination = imageData.uri;
      } else {
        destination = FileSystem.cacheDirectory + fileName.replace(/\s+/g, "");
        // console.log(destination);
        await FileSystem.copyAsync({
          from: imageData.uri,
          to: destination,
        });
      }
      dispatch(checklistActions.addImage(section, index, destination));
      setSelectedIndex(selectedIndex + 1);
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
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      onSave(result);
    }
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
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
        // if (Platform.OS === "web") {
        //   navigation.navigate("CameraModal", { onSave: onSave });
        // } else {
        imagePickerHandler();
        // }
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

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Layout style={styles.screen}>
        <View
          style={[
            styles.titleContainer,
            { backgroundColor: theme["color-primary-400"] },
          ]}
        >
          <Text style={{ fontWeight: "bold" }}>{item.question}</Text>
        </View>
        <KeyboardAwareScrollView extraHeight={200}>
          <ViewPager
            style={{ flex: 1, marginTop: 20 }}
            selectedIndex={selectedIndex}
            onSelect={(i) => setSelectedIndex(i)}
          >
            {/* {imageArray.length > 0 ? (
              renderImages
            ) : ( */}
            <ImageViewPager
              imageArray={imageArray}
              index={index}
              section={section}
            />
            {/* )} */}
          </ViewPager>

          <View style={styles.inputContainer}>
            <Text category="h6">Remarks:</Text>
            <Input
              height={SCREEN_HEIGHT * 0.1}
              multiline
              textStyle={{ minHeight: 64 }}
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

export default QuestionDetailsScreen;

const styles = StyleService.create({
  screen: { flex: 1 },
  titleContainer: {
    padding: 20,
  },
  inputContainer: {
    margin: 20,
  },
});
