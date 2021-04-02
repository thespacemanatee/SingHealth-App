import React from "react";
import { StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  IconRegistry,
  StyleService,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { Provider } from "react-redux";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import * as Notifications from "expo-notifications";

import store from "./src/store/store";
import AppNavigator from "./src/navigation/AppNavigator";
import theme from "./src/theme/theme.json";

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

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <Provider store={store}>
      <PaperProvider theme={paperTheme}>
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <SafeAreaProvider style={styles.screen}>
            {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
            <AppNavigator />
          </SafeAreaProvider>
        </ApplicationProvider>
      </PaperProvider>
    </Provider>
  </>
);

const styles = StyleService.create({
  screen: {
    flex: 1,
    marginTop: Platform.OS === "web" ? 0 : StatusBar.currentHeight,
  },
});
