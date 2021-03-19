import React from "react";
import { StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import databaseReducer from "./src/store/reducers/databaseReducer";
import checklistReducer from "./src/store/reducers/checklistReducer";
import authReducer from "./src/store/reducers/authReducer";
import AppNavigator from "./src/navigation/AppNavigator";
import { default as theme } from "./src/theme/theme.json";

const rootReducer = combineReducers({
  auth: authReducer,
  database: databaseReducer,
  checklist: checklistReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

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
          <SafeAreaProvider
            style={{
              flex: 1,
              marginTop: Platform.OS === "web" ? 0 : StatusBar.currentHeight,
            }}
          >
            {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
            <AppNavigator />
          </SafeAreaProvider>
        </ApplicationProvider>
      </PaperProvider>
    </Provider>
  </>
);
