import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import * as authActions from "../store/actions/authActions";

const DashboardIcon = (props) => <Icon {...props} name="home-outline" />;

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
      onSelect={(index) => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title="DASHBOARD" icon={DashboardIcon} />
      {/* <BottomNavigationTab title="DIRECTORY" icon={DirectoryIcon} /> */}
    </BottomNavigation>
  );
};

const TenantTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <Navigator tabBar={(props) => <BottomNavigationAccessoriesShowcase {...props} />}>
        <Screen name="TenantDashboard" component={TenantDashboardScreen} />
        {/* <Screen name="Directory" component={DirectoryScreen} /> */}
      </Navigator>
    </SafeAreaView>
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
  <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
    <Drawer
      footer={Footer}
      selectedIndex={new IndexPath(state.index)}
      onSelect={(index) => navigation.navigate(state.routeNames[index.row])}>
      <DrawerItem title="Tenant" />
    </Drawer>
  </SafeAreaView>
);

const TenantNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="Tenant" component={TenantTabNavigator} />
    </Navigator>
  );
};

const styles = StyleService.create({
  bottomNavigation: {
    paddingVertical: 8,
  },
});

export default TenantNavigator;
