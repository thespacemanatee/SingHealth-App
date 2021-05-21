import React, { useState } from "react";
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
import * as checklistActions from "../store/actions/checklistActions";
import TenantInfoScreen from "../screens/TenantInfoScreen";
import { stackTransition, modalTransition } from "../helpers/config";
import { NotificationsTabNavigator } from "./StaffNavigator";
import { signOut } from "../features/auth/authSlice";
import { clearDatabase } from "../features/database/databaseSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

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
  const authStore = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  return (
    <>
      <DrawerItem
        title="Logout"
        onPress={() => {
          dispatch(signOut(authStore.expoToken));
          dispatch(checklistActions.clear());
          dispatch(clearDatabase());
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
    <Navigator headerMode="none" mode="modal" screenOptions={modalTransition}>
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
    <Navigator headerMode="none" screenOptions={stackTransition}>
      <Screen name="TenantDashboard" component={TenantDashboardScreen} />
      <Screen name="Notifications" component={NotificationsTabNavigator} />
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
  const authStore = useAppSelector((state) => state.auth);
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none" screenOptions={stackTransition}>
      <Screen
        name="TenantRecords"
        component={TenantInfoScreen}
        initialParams={{
          tenantID: authStore._id,
          stallName: authStore.stallName,
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
