import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { database } from "../data/dummy-database";
import * as databaseActions from "../store/actions/databaseActions";
import * as authActions from "../store/actions/authActions";
import StaffNavigator from "./StaffNavigator";
import TenantNavigator from "./TenantNavigator";
import AuthScreen from "../screens/staff/AuthScreens/AuthScreen";
import LoginScreen from "../screens/staff/AuthScreens/LoginScreen";
import RegisterScreen from "../screens/staff/AuthScreens/RegisterScreen";
import ForgotPasswordScreen from "../screens/staff/AuthScreens/ForgotPasswordScreen";

const { Navigator, Screen } = createStackNavigator();

const AppNavigator = () => {
  const authStore = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(databaseActions.storeDatabase(database));
  }, [database, dispatch]);

  useEffect(() => {
    console.log(authStore);
    dispatch(authActions.restoreToken());
  }, []);

  console.log(authStore.userToken, authStore.userType);

  return (
    <NavigationContainer>
      {authStore.userToken === null ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <Navigator headerMode="none">
            <Screen name="Auth" component={AuthScreen} />
            <Screen name="Login" component={LoginScreen} />
            <Screen name="Register" component={RegisterScreen} />
            <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Navigator>
        </SafeAreaView>
      ) : authStore.userType === "staff" ? (
        <Navigator headerMode="none">
          <Screen name="StaffNavigator" component={StaffNavigator} />
        </Navigator>
      ) : authStore.userType === "tenant" ? (
        <Navigator headerMode="none">
          <Screen name="TenantNavigator" component={TenantNavigator} />
        </Navigator>
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontWeight: "bold" }}>
            A serious error has occurred. You should never see this page.
          </Text>
        </View>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
