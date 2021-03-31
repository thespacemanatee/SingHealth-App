import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Drawer,
  DrawerItem,
  IndexPath,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  Divider,
  StyleService,
} from "@ui-kitten/components";

import TenantDashboardScreen from "../screens/tenant/TenantDashboardScreen";
import RectificationScreen from "../screens/AuditScreens/RectificationScreen";
import RectificationDetailsScreen from "../screens/AuditScreens/RectificationDetailsScreen";
import CameraScreen from "../screens/CameraScreen";
import ExpandImagesScreen from "../screens/ExpandImagesScreen";
import * as authActions from "../store/actions/authActions";

const DashboardIcon = (props) => <Icon {...props} name="home-outline" />;

const Footer = () => {
  const dispatch = useDispatch();

  return (
    <>
      <DrawerItem
        title="Logout"
        onPress={() => {
          dispatch(authActions.signOut());
        }}
      />
      <Divider />
    </>
  );
};

const DrawerContent = ({ navigation, state }) => (
  <SafeAreaView style={styles.screen}>
    <Drawer
      footer={Footer}
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}
    >
      <DrawerItem title="Dashboard" />
    </Drawer>
  </SafeAreaView>
);

const TenantNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="Tenant" component={TenantModalStackNavigator} />
    </Navigator>
  );
};

const TenantModalStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none" mode="modal">
      <Screen name="TenantTabNavigator" component={TenantTabNavigator} />
      <Screen name="CameraModal" component={CameraScreen} />
      <Screen name="ExpandImages" component={ExpandImagesScreen} />
    </Navigator>
  );
};

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
      {/* <BottomNavigationTab title="DIRECTORY" icon={DirectoryIcon} /> */}
    </BottomNavigation>
  );
};

const TenantTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <SafeAreaView style={styles.screen}>
      <Navigator
        tabBar={(props) => <BottomNavigationAccessoriesShowcase {...props} />}
      >
        <Screen name="TenantDashboard" component={TenantDashboardScreen} />
        <Screen name="Rectification" component={RectificationScreen} />
        <Screen
          name="RectificationDetails"
          component={RectificationDetailsScreen}
        />
        {/* <Screen name="Directory" component={DirectoryScreen} /> */}
      </Navigator>
    </SafeAreaView>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  bottomNavigation: {
    paddingVertical: 8,
  },
});

export default TenantNavigator;
