import React, { useState, useEffect, Fragment, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Alert,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
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

import alert from "../../../components/CustomAlert";
import * as checklistActions from "../../../store/actions/checklistActions";
import { selectCurve } from "react-native-redash";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const { item } = route.params;
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);

  const theme = useTheme();

  const dispatch = useDispatch();

  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const changeTextHandler = (value) => {
    setValue(value);
    console.log(value);
    dispatch(checklistActions.addRemarks(index, value));
  };

  const renderImages = useCallback(
    imageArray.map((imageUri, pager_index) => {
      return (
        <View
          key={pager_index}
          style={{
            ...styles.shadowContainer,
            height: Platform.OS === "web" ? "100%" : null,
          }}
        >
          <View
            style={{
              ...styles.imageContainer,
              height: Platform.OS === "web" ? "100%" : null,
            }}
          >
            <Image
              style={styles.image}
              source={{
                uri: imageUri,
              }}
            />
            <Button
              style={{ position: "absolute", right: 0, bottom: 0 }}
              appearance="ghost"
              status="control"
              size="giant"
              onPress={() => {
                alert("Delete Image", "Are you sure?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      dispatch(
                        checklistActions.deleteImage(index, selectedIndex)
                      );
                    },
                  },
                ]);
              }}
            >
              Delete
            </Button>
          </View>
        </View>
      );
    }),
    [selectedIndex, imageArray]
  );

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  useEffect(() => {
    const storeImageUri =
      checklistStore.chosen_checklist.questions[index].image.uri;
    const storeRemarks =
      checklistStore.chosen_checklist.questions[index].image.remarks;
    if (storeImageUri) {
      setImageArray(storeImageUri);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
  }, [checklistStore]);

  const onSave = async (imageData) => {
    const fileName = checklistStore.chosen_tenant.name + Date.now();
    let destination;
    if (Platform.OS === "web") {
      destination = imageData.uri;
    } else {
      destination = FileSystem.cacheDirectory + fileName.replace(/\s+/g, "");
      console.log(destination);
      await FileSystem.copyAsync({
        from: imageData.uri,
        to: destination,
      });
    }
    dispatch(checklistActions.addImage(index, destination));
  };

  const __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      navigation.navigate("CameraModal", { onSave: onSave });
    } else {
      Alert.alert("Access denied");
    }
  };

  const imagePickerHandler = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

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
          navigation.navigate("CameraModal", { onSave: onSave });
        } else {
          __startCamera();
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
      <Fragment>
        <CameraAction />
        <ImageAction />
      </Fragment>
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={[
              styles.titleContainer,
              { backgroundColor: theme["color-primary-400"] },
            ]}
          >
            <Text style={{ fontWeight: "bold" }}>{item.question}</Text>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior="padding"
            keyboardVerticalOffset={100}
          >
            <ViewPager
              style={{ height: "70%" }}
              selectedIndex={selectedIndex}
              onSelect={(index) => setSelectedIndex(index)}
            >
              {imageArray.length > 0 ? (
                renderImages
              ) : (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
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
                          justifyContent: "center",
                          alignContent: "center",
                          padding: 50,
                        }}
                      >
                        <Text>No Images. Start adding some!</Text>
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
                height={SCREEN_HEIGHT * 0.075}
                multiline={true}
                // textStyle={{ minHeight: 64 }}
                placeholder="Enter your remarks here"
                value={value}
                onChangeText={changeTextHandler}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
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
    margin: 20,
  },
  imageContainer: {
    // position: "absolute",
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.7,
    borderRadius: 20,
  },
  image: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  inputContainer: {
    margin: 20,
  },
});
