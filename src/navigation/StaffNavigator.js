import React, { Fragment, useState } from "react";
import { StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
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

import StaffDashboardScreen from "../screens/staff/StaffDashboardScreen";
import DirectoryScreen from "../screens/staff/DirectoryScreens/DirectoryScreen";
import ChooseTenantScreen from "../screens/staff/AuditScreens/ChooseTenantScreen";
import ChecklistScreen from "../screens/staff/AuditScreens/ChecklistScreen";
import QuestionDetailsScreen from "../screens/staff/AuditScreens/QuestionDetailsScreen";
import CameraScreen from "../screens/CameraScreen";
import TenantsDirectoryScreen from "../screens/staff/DirectoryScreens/TenantsDirectoryScreen";

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

const DrawerContent = ({ navigation, state }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
    <Drawer
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
    >
      <DrawerItem title="Staff" />
    </Drawer>
  </SafeAreaView>
);

const StaffNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="StaffModalStack" component={StaffModalStackNavigator} />
    </Navigator>
  );
};

const StaffModalStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none" mode="modal">
      <Screen name="StaffTabNavigator" component={StaffTabNavigator} />
      <Screen name="CameraModal" component={CameraScreen} />
    </Navigator>
  );
};

const StaffTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navigator
        tabBar={(props) => <BottomNavigationAccessoriesShowcase {...props} />}
      >
        <Screen
          name="StaffDashboardStack"
          component={StaffDashboardStackNavigator}
        />
        <Screen
          name="StaffDirectoryStack"
          component={StaffDirectoryStackNavigator}
        />
      </Navigator>
    </SafeAreaView>
  );
};

const StaffDashboardStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none">
      <Screen name="StaffDashboard" component={StaffDashboardScreen} />
      <Screen name="ChooseTenant" component={ChooseTenantScreen} />
      <Screen name="Checklist" component={ChecklistScreen} />
      <Screen name="QuestionDetails" component={QuestionDetailsScreen} />
    </Navigator>
  );
};

const StaffDirectoryStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none">
      <Screen name="Directory" component={DirectoryScreen} />
      <Screen name="TenantsDirectory" component={TenantsDirectoryScreen} />
    </Navigator>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    paddingVertical: 8,
  },
});

export default StaffNavigator;
