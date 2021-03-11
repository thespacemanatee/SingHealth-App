import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Text,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const login = (userType) => {
    const loginOptions = {
      url: `http://localhost:5000/test_login/${userType}`,
      method: "get",
    };
    axios(loginOptions)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TopNavigation title="Login" alignment="center" />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Login Screen</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default LoginScreen;
