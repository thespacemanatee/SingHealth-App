import React from "react";
import { View } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  StyleService,
  Icon,
} from "@ui-kitten/components";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "../../../components/ui/Logo";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;

const ManageTenantAccountsScreen = ({ navigation }) => {
  const DrawerAction = () => (
    <TopNavigationAction
      icon={DrawerIcon}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  );

  const handleRegister = () => {
    navigation.navigate("CreateTenant");
  };

  const handleDelete = () => {
    navigation.navigate("DeleteTenant");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <TopNavigation
        title="Manage Tenant Accounts"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <View style={styles.logo}>
          <Logo />
        </View>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={handleRegister}>
            Create Tenant Account
          </Button>
          <Button appearance="outline" onPress={handleDelete}>
            Delete Tenant Account
          </Button>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  layout: {
    flex: 1,
    justifyContent: "space-between",
  },
  logo: {
    width: "100%",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default ManageTenantAccountsScreen;
