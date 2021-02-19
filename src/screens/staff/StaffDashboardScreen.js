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

import { database } from "../../data/dummy-database";
import Graph from "../../components/ui/graph/Graph";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const relevantAudits = useSelector((state) => state.database.relevantAudits);
  console.log(relevantAudits);
  const [] = useState([]);
  // console.log(database);
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

  const renderActiveAudits = (itemData) => {
    // console.log(database.audits.audits);
    const auditID = `${itemData.item}`;
    const tenantID = database.audits.audits[auditID].tenantID;
    const tenantInfo = database.tenants.tenants[tenantID];
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
  };

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
            data={database.audits.active_audits}
            renderItem={renderActiveAudits}
          />
        </View>
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
    flex: 0.4,
  },
  listContainer: {
    flex: 0.6,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
