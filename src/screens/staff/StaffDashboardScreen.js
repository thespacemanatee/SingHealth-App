import React, { useState, useCallback, useEffect } from "react";
import { View, Platform } from "react-native";
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
} from "@ui-kitten/components";
import { FAB } from "react-native-paper";

import Graph from "../../components/ui/graph/Graph.tsx";
import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import { handleErrorResponse } from "../../store/actions/authActions";
import CenteredLoading from "../../components/ui/CenteredLoading";
import SkeletonLoading from "../../components/ui/SkeletonLoading";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const databaseStore = useSelector((state) => state.database);
  const [state, setState] = useState({ open: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState([]);

  const dispatch = useDispatch();

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

  const handleRefreshList = () => {
    setLoading(true);
    getListData();
  };

  const handleOpenAudit = useCallback(
    async (auditID, tenantID) => {
      try {
        setLoading(true);
        console.log(auditID);
        const tenantObj = databaseStore.relevantTenants.find((e) => {
          return e.tenantID === tenantID;
        });
        console.log(tenantObj);
        await dispatch(
          checklistActions.getAuditData(auditID, tenantObj.stallName)
        );
        navigation.navigate("Rectification", { auditID });
      } catch (err) {
        handleErrorResponse(err);
        setError(err.message);
      }
    },
    [databaseStore.relevantTenants, dispatch, navigation]
  );

  const renderActiveAudits = useCallback(
    ({ item }) => {
      return (
        <View style={styles.item}>
          <ActiveAuditCard
            userType={authStore.userType}
            item={item}
            onPress={handleOpenAudit}
          />
        </View>
      );
    },
    [authStore.userType, handleOpenAudit]
  );

  const getListData = useCallback(async () => {
    try {
      const res = await dispatch(
        databaseActions.getStaffActiveAudits(authStore.institutionID)
      );
      await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );
      console.log(res.data.data);
      setListData(res.data.data);
      setLoading(false);
    } catch (err) {
      handleErrorResponse(err);
      setError(err.message);
    }
  }, [authStore.institutionID, dispatch]);

  useEffect(() => {
    // Subscribe for the focus Listener
    getListData();

    const unsubscribe = navigation.addListener("focus", () => {
      getListData();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getListData, navigation]);

  const LoadingComponent = () => {
    return Platform.OS === "web" ? <CenteredLoading /> : <SkeletonLoading />;
  };

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
        <Graph />
        <Divider />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Rectification Progress</Text>
        </View>
        {!loading ? (
          <List
            contentContainerStyle={styles.contentContainer}
            data={listData}
            renderItem={renderActiveAudits}
            onRefresh={handleRefreshList}
            refreshing={loading}
          />
        ) : (
          <LoadingComponent />
        )}

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
    paddingVertical: 4,
  },
});
