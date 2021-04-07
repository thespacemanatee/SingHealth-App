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

import Graph from "../../components/ui/graph/Graph.tsx";
import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
// import SkeletonLoading from "../../components/ui/SkeletonLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import SkeletonLoading from "../../components/ui/loading/SkeletonLoading";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [state, setState] = useState({ open: false });
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
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
      console.log(res.data.data);
      setListData(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [authStore.institutionID, dispatch]);

  const getGraphData = async () => {
    try {
      const res = await dispatch(databaseActions.getGraphData());
      console.log(res);
    } catch (err) {
      handleErrorResponse(err);
    }
  };

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
  }, [getListData, navigation]);

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
        <Graph label="Average Scores (All Institutions)" />
        <Divider />
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
  emptyComponent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});
