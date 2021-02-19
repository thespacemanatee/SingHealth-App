import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider, Layout, TopNavigation } from "@ui-kitten/components";

import { database } from "../data/dummy-database";
import * as databaseActions from "../store/actions/databaseActions";

export const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(databaseActions.storeDatabase(database));
  }, [database, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
    </SafeAreaView>
  );
};
