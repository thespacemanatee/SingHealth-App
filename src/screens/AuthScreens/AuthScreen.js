import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  StyleService,
} from "@ui-kitten/components";

import Logo from "../../components/ui/Logo";
import alert from "../../components/CustomAlert";

const AuthScreen = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState("");

  console.log(expoPushToken);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    // eslint-disable-next-line consistent-return
    return token;
  };
  const handleLogin = () => {
    navigation.navigate("Login", { expoPushToken });
  };

  const handleRegister = () => {
    navigation.navigate("Register", { expoPushToken });
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      registerForPushNotificationsAsync().then((token) =>
        setExpoPushToken(token)
      );
    }
  }, []);

  return (
    <View style={styles.screen}>
      <TopNavigation title="Authentication" alignment="center" />
      <Divider />
      <Layout style={styles.layout}>
        <Logo />
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={handleLogin}>
            Login
          </Button>
          <Button appearance="outline" onPress={handleRegister}>
            Sign Up
          </Button>
        </View>
      </Layout>
    </View>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default AuthScreen;
