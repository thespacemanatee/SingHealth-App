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
    <View style={styles.screen}>
      <TopNavigation
        title="Manage Tenant Accounts"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <Logo />
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={handleRegister}>
            Create Tenant Account
          </Button>
          <Button appearance="outline" onPress={handleDelete}>
            Delete Tenant Account
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

export default ManageTenantAccountsScreen;
