import React from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  StyleService,
} from "@ui-kitten/components";

import Logo from "../../components/ui/Logo";

const AuthScreen = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.screen}>
      <TopNavigation title="Authentication" alignment="center" />
      <Divider />
      <Layout style={styles.layout}>
        <Logo />
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={handleLogin}>
            Login
          </Button>
          <Button appearance="outline" onPress={handleRegister}>
            Sign Up
          </Button>
        </View>
      </Layout>
    </View>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default AuthScreen;
