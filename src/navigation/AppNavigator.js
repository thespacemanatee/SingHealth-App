import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import { HomeNavigator } from "../navigation/HomeNavigator";

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
