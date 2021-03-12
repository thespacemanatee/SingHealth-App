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
        <Text>Welcome to BTS SingHealth App!</Text>
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
