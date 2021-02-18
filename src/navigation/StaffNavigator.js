import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Drawer,
  DrawerItem,
  Layout,
  Text,
  IndexPath,
  BottomNavigation,
  BottomNavigationTab,
} from "@ui-kitten/components";

import { StaffDashboardScreen } from "../screens/staff/StaffDashboardScreen";
import { DirectoryScreen } from "../screens/staff/DirectoryScreen";

const StaffBottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="DASHBOARD" />
    <BottomNavigationTab title="DIRECTORY" />
  </BottomNavigation>
);

const StaffTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <Navigator tabBar={(props) => <StaffBottomTabBar {...props} />}>
      <Screen name="StaffDashboard" component={StaffDashboardScreen} />
      <Screen name="Directory" component={DirectoryScreen} />
    </Navigator>
  );
};

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
  >
    <DrawerItem title="Staff" />
  </Drawer>
);

export const StaffNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="Staff" component={StaffTabNavigator} />
    </Navigator>
  );
};
