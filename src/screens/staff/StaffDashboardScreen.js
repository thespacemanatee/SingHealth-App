import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  Divider,
  Icon,
  Layout,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  List,
  Card,
} from "@ui-kitten/components";
import { FAB } from "react-native-paper";

import { database } from "../../data/dummy-database";
import Graph from "../../components/ui/graph/Graph";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

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

  const renderActiveAudits = useCallback(
    (itemData) => {
      const auditID = `${itemData.item}`;
      const tenantID = database.audits.audits[auditID].tenantID;
      const tenantInfo = database.tenants[tenantID];
      return (
        <Card
          style={styles.item}
          status="basic"
          // header={itemData.item}
          // footer={itemData.item}
        >
          <Text>{tenantInfo.name}</Text>
        </Card>
      );
    },
    [databaseStore]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Dashboard"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <Layout style={styles.screen}>
        <View style={styles.graphContainer}>
          <Graph />
        </View>
        <View style={styles.listContainer}>
          <List
            contentContainerStyle={styles.contentContainer}
            data={databaseStore.audits.active_audits}
            renderItem={renderActiveAudits}
          />
        </View>

        <FAB.Group
          open={open}
          icon="plus"
          actions={[
            {
              icon: "pencil-plus",
              label: "Create new checklist",
              onPress: () => console.log("Pressed new checklist"),
            },
            {
              icon: "file-plus",
              label: "New Audit",
              onPress: () => {
                navigation.navigate("ChooseTenant");
              },
              small: false,
            },
          ]}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Layout>
    </SafeAreaView>
  );
};

export default StaffDashboardScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  graphContainer: {
    flex: 0.35,
  },
  listContainer: {
    flex: 0.65,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
