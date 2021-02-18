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

import { TenantDashboardScreen } from "../screens/tenant/TenantDashboardScreen";

const TenantBottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}
  >
    <BottomNavigationTab title="DASHBOARD" />
    <BottomNavigationTab title="DIRECTORY" />
  </BottomNavigation>
);

const TenantTabNavigator = () => {
  const { Navigator, Screen } = createBottomTabNavigator();
  return (
    <Navigator tabBar={(props) => <TenantBottomTabBar {...props} />}>
      <Screen name="TenantDashboard" component={TenantDashboardScreen} />
      {/* <Screen name="Orders" component={OrdersScreen} /> */}
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

export const TenantNavigator = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  return (
    <Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Screen name="Tenant" component={TenantTabNavigator} />
    </Navigator>
  );
};
