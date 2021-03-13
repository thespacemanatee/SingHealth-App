import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
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
  useTheme,
} from "@ui-kitten/components";
import { FAB } from "react-native-paper";

import Graph from "../../components/ui/graph/Graph";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [state, setState] = useState({ open: false });

  const theme = useTheme();

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
      const tenantID = databaseStore.audits.audits[auditID].tenantID;
      const tenantInfo = databaseStore.tenants[tenantID];
      return (
        <Card
          style={[styles.item, { backgroundColor: theme["color-info-100"] }]}
          status="info"
          activeOpacity={0.5}
          // header={itemData.item}
          // footer={itemData.item}
        >
          <View>
            <Text>{tenantInfo.name}</Text>
          </View>
        </Card>
      );
    },
    [databaseStore]
  );

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation
        title="Dashboard"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <Layout style={styles.screen}>
        <Graph />
        <Divider />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Rectification Progress</Text>
        </View>
        <List
          contentContainerStyle={styles.contentContainer}
          data={databaseStore.audits.active_audits}
          renderItem={renderActiveAudits}
        />

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
    </View>
  );
};

export default StaffDashboardScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  textContainer: {
    marginLeft: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 26,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});
