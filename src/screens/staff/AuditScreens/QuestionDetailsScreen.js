import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  Card,
  StyleService,
  List,
} from "@ui-kitten/components";
import { Camera } from "expo-camera";

import * as checklistActions from "../../../store/actions/checklistActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera" />;
let camera;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const { index } = route.params;
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const dispatch = useDispatch();

  const CameraPreview = ({ photo }) => {
    console.log("Photo", photo);
    return (
      <View
        style={{
          backgroundColor: "transparent",
          flex: 1,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageBackground
          source={{ uri: photo && photo.uri }}
          style={{
            flex: 1,
          }}
        />
      </View>
    );
  };

  const __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
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
    <TopNavigationAction icon={CameraIcon} onPress={cameraHandler} />
  );

  return startCamera ? (
    previewVisible && capturedImage ? (
      <CameraPreview photo={capturedImage} />
    ) : (
      <Camera
        style={{ flex: 1, width: "100%" }}
        ref={(r) => {
          camera = r;
        }}
      >
        <View style={styles.cameraScreen}>
          <View style={styles.cameraButtonContainer}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={__takePicture}
            />
          </View>
        </View>
      </Camera>
    )
  ) : (
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
        <Text>{index}</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default QuestionDetailsScreen;

const styles = StyleService.create({
  cameraScreen: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
  },
  cameraButtonContainer: {
    alignSelf: "center",
    flex: 1,
    alignItems: "center",
  },
  cameraButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
});
