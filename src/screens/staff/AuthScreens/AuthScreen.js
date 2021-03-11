import React, { useState, useEffect } from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Text,
} from "@ui-kitten/components";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Authentication" alignment="center" />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Welcome!</Text>
        <Button onPress={() => navigation.navigate("Login")}>
          Login
        </Button>
        <Button appearance="outline" onPress={() => navigation.navigate("Register")}>
          Sign Up
        </Button>
      </Layout>
    </View>
  );
};

export default LoginScreen;
