import React, { useState, useEffect, useCallback } from "react";
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

const useInputState = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  return { value, onChangeText: setValue };
};

const QuestionDetailsScreen = ({ route, navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const [savedImage, setSavedImage] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [remarks, setRemarks] = useState([]);

  const dispatch = useDispatch();

  const multilineInputState = useInputState();

  const renderImages = imageArray.map((imageUri, index) => {
    return (
      <View key={index} style={styles.shadowContainer}>
        <View style={styles.imageContainer}>
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
    if (checklistStore.chosen_checklist.questions[index].image.uri) {
      setImageArray(checklistStore.chosen_checklist.questions[index].image.uri);
    }
    console.log(imageArray);
  }, [checklistStore, savedImage]);

  const onSave = async (imageData) => {
    const currentTime = Date.now();
    const destination =
      FileSystem.documentDirectory + "audit_images/" + currentTime;
    await FileSystem.copyAsync({
      from: imageData.uri,
      to: destination,
    });
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
        <View style={styles.inputContainer}>
          <Text category="h6">Remarks:</Text>
          <Input
            multiline={true}
            textStyle={{ minHeight: 64 }}
            placeholder="Multiline"
            {...multilineInputState}
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
