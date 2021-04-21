import React, { useState } from "react";
import { Platform, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
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
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from "@ui-kitten/components";

import StaffDashboardScreen from "../screens/staff/StaffDashboardScreen";
import DirectoryScreen from "../screens/staff/DirectoryScreens/DirectoryScreen";
import ChooseTenantScreen from "../screens/staff/ChooseTenantScreen";
import ChooseSavedScreen from "../screens/staff/ChooseSavedScreen";
import ChecklistScreen from "../screens/AuditScreens/ChecklistScreen";
import RectificationScreen from "../screens/AuditScreens/RectificationScreen";
import QuestionDetailsScreen from "../screens/AuditScreens/QuestionDetailsScreen";
import RectificationDetailsScreen from "../screens/AuditScreens/RectificationDetailsScreen";
import StaffRectificationScreen from "../screens/AuditScreens/StaffRectificationScreen";
import AuditSubmitScreen from "../screens/AuditScreens/AuditSubmitScreen";
import CameraScreen from "../screens/CameraScreen";
import TenantsDirectoryScreen from "../screens/staff/DirectoryScreens/TenantsDirectoryScreen";
import * as authActions from "../store/actions/authActions";
import * as checklistActions from "../store/actions/checklistActions";
import * as databaseActions from "../store/actions/databaseActions";
import ManageTenantAccountsScreen from "../screens/staff/AddTenantScreens/ManageTenantAccountsScreen";
import CreateTenantScreen from "../screens/staff/AddTenantScreens/CreateTenantScreen";
import ExpandImagesScreen from "../screens/ExpandImagesScreen";
import TenantInfoScreen from "../screens/TenantInfoScreen";
import DeleteTenantScreen from "../screens/staff/AddTenantScreens/DeleteTenantScreen";
import SelectDeleteScreen from "../screens/staff/AddTenantScreens/SelectDeleteScreen";
import { stackTransition, modalTransition } from "../helpers/config";
import NotificationsScreen from "../screens/NotificationsScreen";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
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

const Footer = () => {
  const authStore = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(authActions.signOut(authStore.expoToken));
    dispatch(checklistActions.clear());
    dispatch(databaseActions.clear());
  };

  return (
    <>
      <DrawerItem title="Logout" onPress={handleLogout} />
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
      <DrawerItem title="Manage Tenants" />
    </Drawer>
  </SafeAreaView>
);

const StaffNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="StaffModalStack" component={StaffModalStackNavigator} />
      <Screen name="AddTenantStack" component={AddTenantStackNavigator} />
    </Navigator>
  );
};

const StaffModalStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none" mode="modal" screenOptions={modalTransition}>
      <Screen name="StaffTabNavigator" component={StaffTabNavigator} />
      <Screen name="CameraModal" component={CameraScreen} />
      <Screen name="ExpandImages" component={ExpandImagesScreen} />
    </Navigator>
  );
};

const StaffTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <SafeAreaView style={styles.screen}>
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
    <Navigator headerMode="none" screenOptions={stackTransition}>
      <Screen name="StaffDashboard" component={StaffDashboardScreen} />
      <Screen name="Notifications" component={NotificationsScreen} />
      <Screen name="ChooseTenant" component={ChooseTenantTopTabNavigator} />
      <Screen name="Checklist" component={ChecklistScreen} />
      <Screen name="Rectification" component={RectificationScreen} />
      <Screen name="QuestionDetails" component={QuestionDetailsScreen} />
      <Screen
        name="RectificationDetails"
        component={RectificationDetailsScreen}
      />
      <Screen name="StaffRectification" component={StaffRectificationScreen} />
      <Screen name="AuditSubmit" component={AuditSubmitScreen} />
    </Navigator>
  );
};

const ChooseTenantTopTabNavigator = ({ navigation }) => {
  const { Navigator, Screen } = createMaterialTopTabNavigator();

  const theme = useTheme();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          window.history.back();
        } else {
          navigation.goBack();
        }
      }}
    />
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Tenant Selection"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Navigator
        initialRouteName="Tenants"
        backBehavior="none"
        tabBarOptions={{
          labelStyle: { fontSize: 12, fontFamily: "SFProDisplay-Regular" },
          indicatorStyle: { backgroundColor: theme["color-primary-500"] },
        }}
      >
        <Screen
          name="Tenants"
          component={ChooseTenantScreen}
          options={{ tabBarLabel: "Available" }}
        />
        <Screen
          name="Saved"
          component={ChooseSavedScreen}
          options={{ tabBarLabel: "Saved" }}
        />
      </Navigator>
    </View>
  );
};

const AddTenantStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <SafeAreaView style={styles.screen}>
      <Navigator headerMode="none" screenOptions={stackTransition}>
        <Screen
          name="ManageTenantAccounts"
          component={ManageTenantAccountsScreen}
        />
        <Screen name="CreateTenant" component={CreateTenantScreen} />
        <Screen name="DeleteTenant" component={DeleteTenantScreen} />
        <Screen name="SelectDelete" component={SelectDeleteScreen} />
      </Navigator>
    </SafeAreaView>
  );
};

const StaffDirectoryStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none" screenOptions={stackTransition}>
      <Screen name="Directory" component={DirectoryScreen} />
      <Screen name="TenantsDirectory" component={TenantsDirectoryScreen} />
      <Screen name="TenantInfo" component={TenantInfoScreen} />
      <Screen name="Rectification" component={RectificationScreen} />
      <Screen
        name="RectificationDetails"
        component={RectificationDetailsScreen}
      />
      <Screen name="StaffRectification" component={StaffRectificationScreen} />
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

export default StaffNavigator;
