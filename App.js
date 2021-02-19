import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

import { databaseReducer } from "./src/store/reducers/databaseReducer";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { default as theme } from "./src/theme/theme.json";

const rootReducer = combineReducers({
  database: databaseReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <Provider store={store}>
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
          <AppNavigator />
        </SafeAreaView>
      </ApplicationProvider>
    </Provider>
  </>
);
