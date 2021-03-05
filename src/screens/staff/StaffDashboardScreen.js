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

  // const testBackend = () => {
  //   fetch("http://localhost:5000/audits", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       auditMetadata: {
  //         staffID: "CGH_Staff1",
  //         tenantID: "CGH_Tenant1",
  //         institutionID: "CGH",
  //         date: "2012-04-23T18:25:43.511Z",
  //       },
  //       auditForms: {
  //         fnb: {
  //           type: "fnb",
  //           questions: [
  //             {
  //               question: "Store is clean",
  //               answer: true,
  //             },
  //             {
  //               question: "Store is covid-free",
  //               answer: false,
  //               image: ["image001", "image002"],
  //               remarks: "Case #36475 traced back here",
  //               deadline: "2012-04-23T18:25:43.511Z",
  //             },
  //             {
  //               question: "Personnel observed personal hygiene",
  //               answer: false,
  //               image: ["image001", "image002"],
  //               remarks: "Ill personal came back to work",
  //               deadline: "2012-04-23T18:25:43.511Z",
  //             },
  //           ],
  //         },
  //       },
  //     }),
  //   })
  //     .then((response) => {
  //       console.log(response.toString());
  //     })
  //     .catch((error) => {
  //       console.error(error.toString());
  //     });
  // };

  // useEffect(() => {
  //   testBackend();
  // }, [state]);

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
        <View style={styles.graphContainer}>
          <Graph />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Rectification Progress</Text>
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
    </View>
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
  textContainer: {
    marginLeft: 20,
    marginBottom: 20,
  },
  text: {
    fontSize: 26,
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
