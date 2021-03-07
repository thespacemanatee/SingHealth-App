import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, Divider, Layout, TopNavigation } from "@ui-kitten/components";
import * as Permissions from "expo-permissions";

import { database } from "../data/dummy-database";
import * as databaseActions from "../store/actions/databaseActions";
import alert from "../components/CustomAlert";

export const HomeScreen = ({ navigation }) => {
  // const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  // const permissionFlow = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

  //   setStatus(status);

  //   if (status !== "granted") {
  //     alert("Boo", "Why no accept?", [{ text: "OK" }]);
  //   }
  // };

  // useEffect(() => {
  //   permissionFlow();
  // }, [permissionFlow]);

  useEffect(() => {
    dispatch(databaseActions.storeDatabase(database));
  }, [database, dispatch]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopNavigation title="SingHealth" alignment="center" />
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
    </View>
  );
};
