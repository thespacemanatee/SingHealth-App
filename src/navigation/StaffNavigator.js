import React, { useState } from "react";
import { useDispatch } from "react-redux";
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

import StaffDashboardScreen from "../screens/staff/StaffDashboardScreen";
// import DirectoryScreen from "../screens/staff/DirectoryScreens/DirectoryScreen";
import ChooseTenantScreen from "../screens/staff/AuditScreens/ChooseTenantScreen";
import ChecklistScreen from "../screens/staff/AuditScreens/ChecklistScreen";
import RectificationScreen from "../screens/staff/AuditScreens/RectificationScreen";
import QuestionDetailsScreen from "../screens/staff/AuditScreens/QuestionDetailsScreen";
import RectificationDetailsScreen from "../screens/staff/AuditScreens/RectificationDetailsScreen";
import AuditSubmitScreen from "../screens/staff/AuditScreens/AuditSubmitScreen";
import CameraScreen from "../screens/CameraScreen";
import TenantsDirectoryScreen from "../screens/staff/DirectoryScreens/TenantsDirectoryScreen";
import * as authActions from "../store/actions/authActions";
import AddTenantCredScreen from "../screens/staff/AddTenantScreens/AddTenantCredScreen";
import ExpandImagesScreen from "../screens/ExpandImagesScreen";

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
      <DrawerItem title="Manage Tenants" />
    </Drawer>
  </SafeAreaView>
);

const StaffNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="StaffModalStack" component={StaffModalStackNavigator} />
      <Screen name="AddTenantNavigator" component={AddTenantStackNavigator} />
    </Navigator>
  );
};

const StaffModalStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none" mode="modal">
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
    <Navigator headerMode="none">
      <Screen name="StaffDashboard" component={StaffDashboardScreen} />
      <Screen name="ChooseTenant" component={ChooseTenantScreen} />
      <Screen name="Checklist" component={ChecklistScreen} />
      <Screen name="Rectification" component={RectificationScreen} />
      <Screen name="QuestionDetails" component={QuestionDetailsScreen} />
      <Screen
        name="RectificationDetails"
        component={RectificationDetailsScreen}
      />
      <Screen name="AuditSubmit" component={AuditSubmitScreen} />
    </Navigator>
  );
};

// const QuestionDetailsStackNavigator = () => {
//   const { Navigator, Screen } = createStackNavigator();
//   return (
//     <Navigator headerMode="none" mode="modal">
//       <Screen name="Question" component={QuestionDetailsScreen} />
//       <Screen name="ExpandImages" component={ExpandImagesScreen} />
//     </Navigator>
//   );
// };

const AddTenantStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <SafeAreaView style={styles.screen}>
      <Navigator headerMode="none">
        <Screen name="AddTenantCred" component={AddTenantCredScreen} />
      </Navigator>
    </SafeAreaView>
  );
};

const StaffDirectoryStackNavigator = () => {
  const { Navigator, Screen } = createStackNavigator();
  return (
    <Navigator headerMode="none">
      {/* <Screen name="Directory" component={DirectoryScreen} /> */}
      <Screen name="TenantsDirectory" component={TenantsDirectoryScreen} />
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
