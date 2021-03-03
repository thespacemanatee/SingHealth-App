import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Image, Alert, Platform } from "react-native";
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
} from "@ui-kitten/components";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";

import * as checklistActions from "../../../store/actions/checklistActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera-outline" />;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const [savedImage, setSavedImage] = useState(false);
  const [value, setValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);

  const dispatch = useDispatch();

  const changeTextHandler = (value) => {
    setValue(value);
    console.log(value);
    dispatch(checklistActions.addRemarks(index, value));
  };

  const renderImages = imageArray.map((imageUri, index) => {
    return (
      <View
        key={index}
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
        </View>
      </View>
    );
  });

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
    console.log(imageArray);
  }, [checklistStore, savedImage]);

  const onSave = async (imageData) => {
    const fileName = checklistStore.chosen_tenant.name + Date.now();
    let destination;
    if (Platform.OS === "web") {
      destination = imageData.uri;
    } else {
      destination =
        FileSystem.cacheDirectory +
        fileName.replace(/\s+/g, '');
      console.log(destination);
      await FileSystem.copyAsync({
        from: imageData.uri,
        to: destination,
      });
    }
    setSavedImage(!savedImage);
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

  const cameraHandler = () => {
    // Alert.alert("Add an image", "", [
    //   { text: "Cancel", onPress: () => {}, style: "cancel" },
    //   { text: "Choose from Gallery", onPress: () => {} },
    //   { text: "Take Photo", onPress: __startCamera },
    // ]);
    __startCamera();
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
          cameraHandler();
        }
      }}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={CameraAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}
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
              <View style={styles.shadowContainer}>
                <View style={styles.imageContainer}>
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
          style={{
            ...styles.inputContainer,
            marginTop: Platform.OS === "web" ? 40 : null,
          }}
        >
          <Text category="h6">Remarks:</Text>
          <Input
            multiline={true}
            textStyle={{ minHeight: 64 }}
            placeholder="Multiline"
            value={value}
            onChangeText={changeTextHandler}
          />
        </View>
      </Layout>
    </SafeAreaView>
  );
};

export default QuestionDetailsScreen;

const styles = StyleService.create({
  shadowContainer: {
    margin: 20,
  },
  imageContainer: {
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
