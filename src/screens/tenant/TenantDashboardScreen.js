import React, { useState, useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";
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

import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
// import SkeletonLoading from "../../components/ui/SkeletonLoading";
import { handleErrorResponse } from "../../helpers/utils";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const TenantDashboardScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState([]);

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

  const handleRefreshList = () => {
    getListData();
  };

  const handleOpenAudit = useCallback(
    async (auditID, stallName) => {
      try {
        setLoading(true);

        console.log("AuditID:", auditID);

        await dispatch(checklistActions.getAuditData(auditID));

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

  const getListData = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await dispatch(
        databaseActions.getTenantActiveAudits(authStore._id)
      );
      console.log(res.data.data);
      setListData(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [authStore._id, dispatch]);

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
        <Divider />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Outstanding Audits</Text>
        </View>
        <CenteredLoading loading={loading} />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={listData}
          renderItem={renderActiveAudits}
          onRefresh={handleRefreshList}
          refreshing={listLoading}
        />
      </Layout>
    </View>
  );
};

export default TenantDashboardScreen;

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
    fontFamily: "SFProDisplay-Bold",
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    paddingVertical: 4,
  },
});
