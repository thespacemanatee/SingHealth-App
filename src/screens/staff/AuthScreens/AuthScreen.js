import React from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  Text,
  StyleService,
} from "@ui-kitten/components";
import Logo from "../../../components/ui/Logo";

const LoginScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Authentication" alignment="center" />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Logo />
        <View style={styles.buttonsContainer}>
          <Button
            style={{ marginBottom: 10 }}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Button>
          <Button
            appearance="outline"
            onPress={() => navigation.navigate("Register")}
          >
            Sign Up
          </Button>
        </View>
      </Layout>
    </View>
  );
};

const styles = StyleService.create({
  buttonsContainer: {
    width: "100%",
    padding: 20,
  },
});

export default LoginScreen;
