import React, { useState } from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "expo-camera";
import {
  Button,
  StyleService,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";

let camera;
const BackIcon = (props) => <Icon {...props} name="arrow-back" fill="white" />;
const CameraIcon = (props) => <Icon {...props} name="camera" />;
const FlashOnIcon = (props) => <Icon {...props} name="flash" />;
const FlashOffIcon = (props) => <Icon {...props} name="flash-off" />;

const CameraScreen = ({ route, navigation }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [cameraType, setCameraType] = useState("back");

  const WINDOW_WIDTH = Dimensions.get("window").width;
  const CAMERA_VIEW_HEIGHT = (WINDOW_WIDTH / 3) * 4;

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const takePicture = async () => {
    const photo = await camera.takePictureAsync({
      base64: true,
      quality: 0.5,
    });
    console.log(photo);
    setPreviewVisible(true);
    setCapturedImage(photo);
  };
  const savePhoto = () => {
    route.params.onSave(capturedImage);
    navigation.goBack();
  };
  const retakePicture = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
  };
  const handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("auto");
    } else {
      setFlashMode("on");
    }
  };
  const switchCamera = () => {
    if (cameraType === "back") {
      setCameraType("front");
    } else {
      setCameraType("back");
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TopNavigation style={styles.topContainer} accessoryLeft={BackAction} />
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
          />
        </View>
      )}
      <View style={styles.bottomContainer}>
        {previewVisible && capturedImage ? (
          <View style={styles.buttonContainer}>
            <Button
              //   style={styles.button}
              appearance="ghost"
              status="control"
              onPress={retakePicture}
              //   accessoryLeft={StarIcon}
            >
              RETAKE
            </Button>
            <Button
              //   style={styles.button}
              appearance="ghost"
              status="control"
              onPress={savePhoto}
              //   accessoryLeft={StarIcon}
            >
              SAVE
            </Button>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <View style={{ width: WINDOW_WIDTH / 3 }}>
              <Button
                //   style={styles.button}
                appearance="ghost"
                status="control"
                onPress={handleFlashMode}
                accessoryLeft={
                  flashMode === "on" || flashMode === "auto"
                    ? FlashOnIcon
                    : FlashOffIcon
                }
              >
                {
                  // eslint-disable-next-line no-nested-ternary
                  flashMode === "on"
                    ? "ON"
                    : flashMode === "auto"
                    ? "AUTO"
                    : "OFF"
                }
              </Button>
            </View>

            <TouchableOpacity
              onPress={takePicture}
              style={styles.takePictureButton}
            />

            <View style={{ width: WINDOW_WIDTH / 3 }}>
              <Button
                //   style={styles.button}
                appearance="ghost"
                status="control"
                onPress={switchCamera}
                accessoryLeft={CameraIcon}
              >
                {cameraType === "front" ? "FRONT" : "REAR"}
              </Button>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CameraScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
  topContainer: {
    backgroundColor: "black",
  },
  bottomContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  takePictureButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
  },
});
