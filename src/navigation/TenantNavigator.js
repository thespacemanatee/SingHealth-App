import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Drawer,
  DrawerItem,
  Divider,
  IndexPath,
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  StyleService,
} from "@ui-kitten/components";

import TenantDashboardScreen from "../screens/tenant/TenantDashboardScreen";
import RectificationScreen from "../screens/AuditScreens/RectificationScreen";
import RectificationDetailsScreen from "../screens/AuditScreens/RectificationDetailsScreen";
import TenantRectificationScreen from "../screens/AuditScreens/TenantRectificationScreen";
import CameraScreen from "../screens/CameraScreen";
import ExpandImagesScreen from "../screens/ExpandImagesScreen";
import * as authActions from "../store/actions/authActions";
import TenantInfoScreen from "../screens/TenantInfoScreen";

const DashboardIcon = (props) => <Icon {...props} name="home-outline" />;
const ArchiveIcon = (props) => <Icon {...props} name="archive-outline" />;

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
      <BottomNavigationTab title="RECORDS" icon={ArchiveIcon} />
    </BottomNavigation>
  );
};

const Footer = () => {
  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      <DrawerItem
        title="Logout"
        onPress={() => {
          dispatch(authActions.signOut(authStore.expoToken));
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
      <Screen name="TenantModalStack" component={TenantModalStackNavigator} />
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

const TenantTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <SafeAreaView style={styles.screen}>
      <Navigator
        tabBar={(props) => <BottomNavigationAccessoriesShowcase {...props} />}
      >
        <Screen
          name="TenantDashboardStack"
          component={TenantDashboardStackNavigator}
        />
        <Screen
          name="TenantRecordsStack"
          component={TenantRecordsStackNavigator}
        />
      </Navigator>
    </SafeAreaView>
  );
};

const TenantDashboardStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none">
      <Screen name="TenantDashboard" component={TenantDashboardScreen} />
      <Screen name="Rectification" component={RectificationScreen} />
      <Screen
        name="RectificationDetails"
        component={RectificationDetailsScreen}
      />
      <Screen
        name="TenantRectification"
        component={TenantRectificationScreen}
      />
    </Navigator>
  );
};

const TenantRecordsStackNavigator = () => {
  const authStore = useSelector((state) => state.auth);
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none">
      <Screen
        name="TenantRecords"
        component={TenantInfoScreen}
        initialParams={{
          tenantID: authStore._id,
          stallName: authStore.stall.name,
        }}
      />
      <Screen name="Rectification" component={RectificationScreen} />
      <Screen
        name="RectificationDetails"
        component={RectificationDetailsScreen}
      />
      <Screen
        name="TenantRectification"
        component={TenantRectificationScreen}
      />
    </Navigator>
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
