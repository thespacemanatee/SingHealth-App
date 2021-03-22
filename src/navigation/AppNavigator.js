import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleService } from "@ui-kitten/components";

import database from "../data/dummy-database";
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

  const renderNavigator = () => {
    if (authStore.userType === "staff") {
      return (
        <Navigator headerMode="none">
          <Screen name="StaffNavigator" component={StaffNavigator} />
        </Navigator>
      );
    }
    if (authStore.userType === "tenant") {
      return (
        <Navigator headerMode="none">
          <Screen name="TenantNavigator" component={TenantNavigator} />
        </Navigator>
      );
    }
    return (
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          A serious error has occurred. You should never see this page.
        </Text>
      </View>
    );
  };

  useEffect(() => {
    dispatch(databaseActions.storeDatabase(database));
  }, [dispatch]);

  useEffect(() => {
    dispatch(authActions.restoreToken());
  }, [dispatch]);

  console.log(authStore);
  console.log(authStore.userToken, authStore.userType);

  return (
    <NavigationContainer>
      {authStore.userToken === null ? (
        <SafeAreaView style={styles.screen}>
          <Navigator headerMode="none">
            <Screen name="Auth" component={AuthScreen} />
            <Screen name="Login" component={LoginScreen} />
            <Screen name="Register" component={RegisterScreen} />
            <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Navigator>
        </SafeAreaView>
      ) : (
        renderNavigator()
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
