import React, { useState, useCallback } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
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

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);

  const theme = useTheme();

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
      const { tenantID } = databaseStore.audits.audits[auditID];
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
    [databaseStore.audits.audits, databaseStore.tenants, theme]
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Dashboard"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Outstanding Audits</Text>
        </View>
        <List
          contentContainerStyle={styles.contentContainer}
          data={databaseStore.audits.active_audits}
          renderItem={renderActiveAudits}
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
  layout: {
    flex: 1,
  },
  textContainer: {
    margin: 20,
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
