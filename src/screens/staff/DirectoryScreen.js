import React from "react";
import { SafeAreaView } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";

import Graph from "../../components/ui/graph/Graph";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const DirectoryScreen = ({ navigation }) => {
  const DrawerAction = () => (
    <TopNavigationAction
      icon={DrawerIcon}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  );

  const NotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} onPress={() => {}} />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Directory"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Directory</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default DirectoryScreen;
