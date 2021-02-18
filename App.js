import React from "react";
import { View, StatusBar } from "react-native";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { default as theme } from "./src/theme/theme.json";

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
      <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
        <AppNavigator />
      </View>
    </ApplicationProvider>
  </>
);
