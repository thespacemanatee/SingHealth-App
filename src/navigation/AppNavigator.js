import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { database } from "../data/dummy-database";
import * as databaseActions from "../store/actions/databaseActions";
import * as authActions from "../store/actions/authActions";
import StaffNavigator from "../navigation/StaffNavigator";
import TenantNavigator from "../navigation/TenantNavigator";
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

  return (
    <NavigationContainer>
      {authStore.userToken == null ? (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <Navigator headerMode="none">
            <>
              <Screen name="Auth" component={AuthScreen} />
              <Screen name="Login" component={LoginScreen} />
              <Screen name="Register" component={RegisterScreen} />
              <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          </Navigator>
        </SafeAreaView>
      ) : (
        <Navigator headerMode="none">
          <>
            <Screen name="StaffNavigator" component={StaffNavigator} />
            <Screen name="TenantNavigator" component={TenantNavigator} />
          </>
        </Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
