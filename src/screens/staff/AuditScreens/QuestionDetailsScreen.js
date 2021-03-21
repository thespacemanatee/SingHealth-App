import React, { useState, useEffect, useCallback } from "react";
import { View, Image, Alert, Platform, Dimensions } from "react-native";
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
  Button,
} from "@ui-kitten/components";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import alert from "../../../components/CustomAlert";
import * as checklistActions from "../../../store/actions/checklistActions";
import { COVID_SECTION } from "./ChecklistScreen";

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
  const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.5;
  const IMAGE_WIDTH = (IMAGE_HEIGHT / 4) * 3;

  const changeTextHandler = (val) => {
    setValue(val);
    console.log(val);
    dispatch(checklistActions.addRemarks(section, index, val));
  };

  const handleAlert = useCallback(() => {
    alert("Delete Image", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          dispatch(checklistActions.deleteImage(section, index, selectedIndex));
        },
      },
    ]);
  }, [dispatch, index, section, selectedIndex]);

  const renderImages = imageArray.map((imageUri, pagerIndex) => {
    return (
      <View
        key={pagerIndex}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: Platform.OS === "web" ? "100%" : null,
        }}
      >
        <View
          style={[
            styles.shadowContainer,
            { height: Platform.OS === "web" ? "100%" : null },
          ]}
        >
          <View
            style={[
              styles.imageContainer,
              { height: Platform.OS === "web" ? "100%" : null },
            ]}
          >
            <Image
              style={{
                ...styles.image,
                height: IMAGE_HEIGHT,
                width: IMAGE_WIDTH,
              }}
              source={{
                uri: imageUri,
              }}
            />
            <Button
              style={{ position: "absolute", right: 0, bottom: 0 }}
              appearance="ghost"
              status="control"
              size="giant"
              onPress={handleAlert}
            >
              Delete
            </Button>
          </View>
        </View>
      </View>
    );
  });

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
    <View style={{ flex: 1 }}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={renderRightActions}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}
      >
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
            {imageArray.length > 0 ? (
              renderImages
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: Platform.OS === "web" ? "100%" : null,
                }}
              >
                <View
                  style={[
                    styles.shadowContainer,
                    { height: Platform.OS === "web" ? "100%" : null },
                  ]}
                >
                  <View
                    style={[
                      styles.imageContainer,
                      { height: Platform.OS === "web" ? "100%" : null },
                    ]}
                  >
                    <View
                      style={{
                        ...styles.image,
                        height: IMAGE_HEIGHT,
                        width: IMAGE_WIDTH,
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>
                        No Images. Start adding some!
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ViewPager>

          <View
            style={[
              styles.inputContainer,
              { marginTop: Platform.OS === "web" ? 40 : null },
            ]}
          >
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
  titleContainer: {
    padding: 20,
  },
  shadowContainer: {
    // margin: 20,
  },
  imageContainer: {
    // position: "absolute",
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.7,
    borderRadius: 20,
    alignItems: "center",
  },
  image: {
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    borderRadius: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignContent: "center",
    // padding: 50,
  },
  inputContainer: {
    margin: 20,
  },
});
