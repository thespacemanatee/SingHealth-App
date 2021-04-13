import React, { useState } from "react";
import { StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import Constants from "expo-constants";
import {
  ApplicationProvider,
  IconRegistry,
  StyleService,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import * as Notifications from "expo-notifications";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import Toast from "react-native-toast-message";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import theme from "./src/theme/theme.json";
import alert from "./src/components/CustomAlert";
import * as authActions from "./src/store/actions/authActions";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const paperTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FD8352",
    accent: "#FC4A1A",
  },
};

const App = () => {
  const [ready, setReady] = useState(false);
  const [expoToken, setExpoToken] = useState("");

  console.log(expoToken);
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

    if (token) {
      store.dispatch(authActions.saveExpoToken(token));
    }

    // eslint-disable-next-line consistent-return
    return token;
  };

  const loadFonts = async () => {
    await Font.loadAsync({
      // eslint-disable-next-line global-require
      "SFProDisplay-Regular": require("./assets/fonts/SFProDisplay-Regular.ttf"),

      // eslint-disable-next-line global-require
      "SFProDisplay-Bold": require("./assets/fonts/SFProDisplay-Bold.ttf"),
    });
  };

  const loadAppAssets = () => {
    if (Platform.OS !== "web") {
      registerForPushNotificationsAsync().then((token) => setExpoToken(token));
    }
    loadFonts().then();
    store.dispatch(authActions.restoreToken());
  };

  if (!ready) {
    return (
      <AppLoading
        startAsync={loadAppAssets}
        onFinish={() => setReady(true)}
        onError={console.warn}
      />
    );
  }
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider theme={paperTheme}>
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
              <SafeAreaProvider style={styles.screen}>
                {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
                <AppNavigator expoToken={expoToken} />
                <Toast
                  topOffset={StatusBar.currentHeight}
                  ref={(ref) => Toast.setRef(ref)}
                />
              </SafeAreaProvider>
            </ApplicationProvider>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;

const styles = StyleService.create({
  screen: {
    flex: 1,
    // marginTop: Platform.OS === "web" ? 0 : StatusBar.currentHeight,
  },
});
