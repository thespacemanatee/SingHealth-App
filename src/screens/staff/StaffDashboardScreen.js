import React, { useState, useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Icon,
  Layout,
  StyleService,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { FAB } from "react-native-paper";
import moment from "moment";

import Graph from "../../components/ui/graph/Graph.tsx";
import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import SkeletonLoading from "../../components/ui/loading/SkeletonLoading";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState([]);
  const [graphData, setGraphData] = useState();

  const dispatch = useDispatch();

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

  const handleOpenAudit = useCallback(
    async (auditID, stallName) => {
      try {
        setLoading(true);

        console.log("AuditID:", auditID);

        await dispatch(checklistActions.getAuditData(auditID));

        setLoading(false);
        navigation.navigate("Rectification", { stallName });
      } catch (err) {
        handleErrorResponse(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigation]
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

  const renderEmptyComponent = () =>
    listLoading ? (
      <SkeletonLoading />
    ) : (
      <View style={styles.emptyComponent}>
        <CustomText bold>NO OUTSTANDING AUDITS</CustomText>
      </View>
    );

  const getListData = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await dispatch(
        databaseActions.getStaffActiveAudits(authStore.institutionID)
      );
      await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );
      setListData(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [authStore.institutionID, dispatch]);

  const getGraphData = useCallback(async () => {
    try {
      setGraphLoading(true);
      const fromDate = new Date(2021, 3).getTime();
      const toDate = new Date(2021, 4).getTime();
      const res = await dispatch(
        databaseActions.getGraphData(fromDate, toDate)
      );
      console.log(res.data.data);
      const temp = res.data.data.map((e) => ({
        x: moment(e.date).toDate(),
        y: Number.parseFloat(e.avgScore) * 100,
      }));
      console.log(temp.map((p) => [p.x.getTime(), p.y]));
      setGraphData(temp.map((p) => [p.x.getTime(), p.y]));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setGraphLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // Subscribe for the focus Listener
    getListData();
    getGraphData();

    const unsubscribe = navigation.addListener("focus", () => {
      getListData();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getGraphData, getListData, navigation]);

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
        <Graph
          label="Average Scores (All Institutions)"
          data={graphData}
          loading={graphLoading}
        />
        {/* <Divider /> */}
        <CenteredLoading loading={loading} />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          data={listData}
          renderItem={renderActiveAudits}
          onRefresh={getListData}
          refreshing={listLoading}
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={() => (
            <View style={styles.textContainer}>
              <CustomText style={styles.text}>
                Rectification Progress
              </CustomText>
            </View>
          )}
        />

        <FAB
          icon="plus"
          label="New Audit"
          style={styles.fab}
          onPress={() => {
            navigation.navigate("ChooseTenant");
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
    marginVertical: 10,
  },
  text: {
    fontSize: 26,
    fontFamily: "SFProDisplay-Bold",
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  item: {
    paddingVertical: 4,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyComponent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});
