import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { Button, StyleService, Icon } from "@ui-kitten/components";

let camera;
const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera" />;
const FlashOnIcon = (props) => <Icon {...props} name="flash" />;
const FlashOffIcon = (props) => <Icon {...props} name="flash-off" />;

const CameraScreen = ({ route, navigation }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [cameraType, setCameraType] = useState("back");

  const WINDOW_WIDTH = Dimensions.get("window").width;
  const WINDOW_HEIGHT = Dimensions.get("window").height;
  const CAMERA_VIEW_HEIGHT = (WINDOW_WIDTH / 3) * 4;
  const TOOLBAR_TOP_HEIGHT = 64;
  const TOOLBAR_BOTTOM_HEIGHT = (WINDOW_HEIGHT - CAMERA_VIEW_HEIGHT) - TOOLBAR_TOP_HEIGHT;

  const __takePicture = async () => {
    const photo = await camera.takePictureAsync();
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  const __savePhoto = () => {
    route.params.onSave({ image: capturedImage });
    navigation.goBack();
  };
  const __retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };
  const __handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("auto");
    } else {
      setFlashMode("on");
    }
  };
  const __switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "black",
          height: TOOLBAR_TOP_HEIGHT,
          justifyContent: "space-between",
        }}
      >
        <Button
          //   style={styles.button}
          appearance="ghost"
          status="control"
          onPress={() => {
            navigation.goBack();
          }}
          accessoryLeft={BackIcon}
        />
      </View>
      {previewVisible && capturedImage ? (
        <ImageBackground
          source={{ uri: capturedImage && capturedImage.uri }}
          style={{ height: CAMERA_VIEW_HEIGHT }}
        />
      ) : (
        <View style={{ height: CAMERA_VIEW_HEIGHT }}>
          <Camera
            type={cameraType}
            flashMode={flashMode}
            style={{ height: CAMERA_VIEW_HEIGHT }}
            ref={(r) => {
              camera = r;
            }}
          ></Camera>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "black",
          height: TOOLBAR_BOTTOM_HEIGHT,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 40,
        }}
      >
        {previewVisible && capturedImage ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <Button
              //   style={styles.button}
              appearance="ghost"
              status="control"
              onPress={__retakePicture}
              //   accessoryLeft={StarIcon}
            >
              RETAKE
            </Button>
            <Button
              //   style={styles.button}
              appearance="ghost"
              status="control"
              onPress={__savePhoto}
              //   accessoryLeft={StarIcon}
            >
              SAVE
            </Button>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ width: WINDOW_WIDTH / 3 }}>
              <Button
                //   style={styles.button}
                appearance="ghost"
                status="control"
                onPress={__handleFlashMode}
                accessoryLeft={
                  flashMode === "on" || flashMode === "auto"
                    ? FlashOnIcon
                    : FlashOffIcon
                }
              >
                {flashMode === "on"
                  ? "ON"
                  : flashMode === "auto"
                  ? "AUTO"
                  : "OFF"}
              </Button>
            </View>

            <TouchableOpacity
              onPress={__takePicture}
              style={styles.takePictureButton}
            />

            <View style={{ width: WINDOW_WIDTH / 3 }}>
              <Button
                //   style={styles.button}
                appearance="ghost"
                status="control"
                onPress={__switchCamera}
                accessoryLeft={CameraIcon}
              >
                {cameraType === "front" ? "FRONT" : "REAR"}
              </Button>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default CameraScreen;

const styles = StyleService.create({
  takePictureButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
});
