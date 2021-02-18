import React from "react";
import { SafeAreaView } from "react-native";
import { Button, Divider, Layout, TopNavigation } from "@ui-kitten/components";

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        // style={{ height: 56 }}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          onPress={() => {
            navigation.navigate("StaffNavigator");
          }}
        >
          STAFF
        </Button>
        <Button
          onPress={() => {
            navigation.navigate("TenantNavigator");
          }}
        >
          TENANT
        </Button>
      </Layout>
    </SafeAreaView>
  );
};
