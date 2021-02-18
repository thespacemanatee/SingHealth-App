import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens/HomeScreen";
import { StaffNavigator } from "../navigation/StaffNavigator";
import { TenantNavigator } from "../navigation/TenantNavigator";

const { Navigator, Screen } = createStackNavigator();

export const HomeNavigator = () => (
  <Navigator headerMode="none">
    <Screen name="Home" component={HomeScreen} />
    <Screen name="StaffNavigator" component={StaffNavigator} />
    <Screen name="TenantNavigator" component={TenantNavigator} />
  </Navigator>
);
