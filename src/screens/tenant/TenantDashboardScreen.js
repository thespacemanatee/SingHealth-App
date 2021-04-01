import React, { useState, useCallback, useEffect } from "react";
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
} from "@ui-kitten/components";

import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import * as authActions from "../../store/actions/authActions";
import CenteredLoading from "../../components/ui/CenteredLoading";
// import SkeletonLoading from "../../components/ui/SkeletonLoading";
import alert from "../../components/CustomAlert";

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
    async (auditID) => {
      try {
        setLoading(true);

        console.log("AuditID:", auditID);

        await dispatch(
          checklistActions.getAuditData(auditID, authStore.stall.name)
        );

        setLoading(false);
        navigation.navigate("Rectification");
      } catch (err) {
        handleErrorResponse(err);
        setError(err.message);
        setLoading(false);
      }
    },
    [authStore.stall.name, dispatch, handleErrorResponse, navigation]
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
      setListLoading(false);
      setLoading(false);
    } catch (err) {
      handleErrorResponse(err);
      setListLoading(false);
      setLoading(false);
    }
  }, [authStore._id, dispatch, handleErrorResponse]);

  useEffect(() => {
    // Subscribe for the focus Listener
    getListData();

    const unsubscribe = navigation.addListener("focus", () => {
      setListLoading(true);
      getListData();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getListData, navigation]);

  const handleErrorResponse = useCallback(
    (err) => {
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const { data } = err.response;
        console.error(err.response.data);
        console.error(err.response.status);
        console.error(err.response.headers);
        if (err.response.status === 403) {
          dispatch(authActions.signOut());
        } else {
          switch (Math.floor(err.response.status / 100)) {
            case 4: {
              alert("Error", data.description);
              break;
            }
            case 5: {
              alert("Server Error", "Please contact your administrator.");
              break;
            }
            default: {
              alert("Request timeout", "Check your internet connection.");
              break;
            }
          }
        }
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error("Error", err.message);
      }
      console.error(err.config);
    },
    [dispatch]
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
        <Divider />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Outstanding Audits</Text>
        </View>
        <CenteredLoading loading={loading} />
        <List
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
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    paddingVertical: 4,
  },
});
