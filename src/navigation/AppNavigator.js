import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { database } from "../data/dummy-database";
import * as databaseActions from "../store/actions/databaseActions";
import * as authActions from "../store/actions/authActions";
import HomeScreen from "../screens/HomeScreen";
import StaffNavigator from "../navigation/StaffNavigator";
import TenantNavigator from "../navigation/TenantNavigator";
import LoginScreen from "../screens/staff/AuthScreens/LoginScreen";

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
      <Navigator headerMode="none">
        {authStore.userToken == null ? (
          <Screen name="SignIn" component={LoginScreen} />
        ) : (
          <>
            <Screen name="Home" component={HomeScreen} />
            <Screen name="StaffNavigator" component={StaffNavigator} />
            <Screen name="TenantNavigator" component={TenantNavigator} />
          </>
        )}
      </Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
