import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Layout, TopNavigation } from "@ui-kitten/components";

import { database } from "../data/dummy-database";
import * as databaseActions from "../store/actions/databaseActions";
import axios from "axios";

const HomeScreen = ({ navigation }) => {
  // const [status, setStatus] = useState(null);
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

  useEffect(() => {
    dispatch(databaseActions.storeDatabase(database));
  }, [database, dispatch]);

  const handleStaffLogin = () => {
    login("staff");
    navigation.navigate("StaffNavigator");
  };

  const handleTenantLogin = () => {
    login("tenant");
    navigation.navigate("TenantNavigator");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <TopNavigation title="SingHealth" alignment="center" />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onPress={handleStaffLogin}>STAFF</Button>
        <Button onPress={handleTenantLogin}>TENANT</Button>
      </Layout>
    </SafeAreaView>
  );
};

export default HomeScreen;
