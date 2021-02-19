import React, { Fragment, useState } from "react";
import { StyleSheet } from "react-native";
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
  Icon,
} from "@ui-kitten/components";

import TenantDashboardScreen from "../screens/tenant/TenantDashboardScreen";
import DirectoryScreen from "../screens/staff/DirectoryScreen";

const DashboardIcon = (props) => <Icon {...props} name="home-outline" />;

const DirectoryIcon = (props) => <Icon {...props} name="folder-outline" />;

const useBottomNavigationState = (initialState = 0) => {
  const [selectedIndex, setSelectedIndex] = useState(initialState);
  return { selectedIndex, onSelect: setSelectedIndex };
};

export const BottomNavigationAccessoriesShowcase = ({ navigation, state }) => {
  const topState = useBottomNavigationState();

  return (
    <BottomNavigation
      style={styles.bottomNavigation}
      {...topState}
      selectedIndex={state.index}
      onSelect={(index) => navigation.navigate(state.routeNames[index])}
    >
      <BottomNavigationTab title="DASHBOARD" icon={DashboardIcon} />
      <BottomNavigationTab title="DIRECTORY" icon={DirectoryIcon} />
    </BottomNavigation>
  );
};

const TenantTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <Navigator
      tabBar={(props) => <BottomNavigationAccessoriesShowcase {...props} />}
    >
      <Screen name="TenantDashboard" component={TenantDashboardScreen} />
      <Screen name="Directory" component={DirectoryScreen} />
    </Navigator>
  );
};

const DrawerContent = ({ navigation, state }) => (
  <Drawer
    selectedIndex={new IndexPath(state.index)}
    onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
  >
    <DrawerItem title="Tenant" />
  </Drawer>
);

const TenantNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="Tenant" component={TenantTabNavigator} />
    </Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    paddingVertical: 8,
  },
});

export default TenantNavigator;
