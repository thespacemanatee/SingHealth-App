import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  ImageBackground,
  Alert,
  TouchableOpacity,
  Platform,
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
import * as Permissions from "expo-permissions";

import * as checklistActions from "../../../store/actions/checklistActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera" />;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const { index } = route.params;
  const dispatch = useDispatch();

  const __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (Platform.OS === "web") {
      navigation.navigate("CameraModal");
    } else if (status === "granted") {
      navigation.navigate("CameraModal");
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
          navigation.navigate("CameraModal");
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
        <Text>{index}</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default QuestionDetailsScreen;

const styles = StyleService.create({});
