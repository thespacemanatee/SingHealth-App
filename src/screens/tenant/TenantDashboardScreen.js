import React, { useState, useCallback, useEffect } from "react";
import { FlatList, View } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  StyleService,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import moment from "moment";
import { Badge } from "react-native-paper";
import useMountedState from "react-use/lib/useMountedState";
import { RefreshControl } from "react-native-web-refresh-control";

import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import SkeletonLoading from "../../components/ui/loading/SkeletonLoading";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getTenantActiveAudits } from "../../features/database/databaseSlice";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const TenantDashboardScreen = ({ navigation }) => {
  const authStore = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const isMounted = useMountedState();

  const dispatch = useAppDispatch();

  const DrawerAction = () => (
    <TopNavigationAction
      icon={DrawerIcon}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  );

  const NotificationAction = () => (
    <View>
      <Badge style={styles.badge} visible={notificationCount}>
        {notificationCount}
      </Badge>
      <TopNavigationAction
        icon={NotificationIcon}
        onPress={() => {
          navigation.navigate("Notifications");
        }}
      />
    </View>
  );

  const handleRefreshList = () => {
    getListData();
    getNotifications();
  };

  const handleOpenAudit = useCallback(
    async (auditID, stallName) => {
      try {
        setLoading(true);

        await dispatch(checklistActions.getAuditData(auditID));

        navigation.navigate("Rectification", { stallName });
      } catch (err) {
        handleErrorResponse(err);
        if (isMounted()) {
          setError(err.message);
        }
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [dispatch, isMounted, navigation]
  );

  const renderActiveAudits = useCallback(
    ({ item }) => {
      const { auditMetadata, stallName } = item;
      const { _id, score, rectificationProgress } = auditMetadata;
      const dateInfo = moment(auditMetadata.date.$date)
        .toLocaleString()
        .split(" ")
        .slice(0, 5);

      let progress = Number.parseFloat(
        (Number.parseFloat(rectificationProgress) * 100).toFixed(1)
      );
      if (rectificationProgress === undefined) {
        progress = 100;
      }

      return (
        <View style={styles.item}>
          <ActiveAuditCard
            userType={authStore.userType}
            _id={_id}
            stallName={stallName}
            score={score}
            progress={progress}
            dateInfo={dateInfo}
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

      const res = await dispatch(getTenantActiveAudits(authStore._id));
      if (isMounted()) {
        setListData(res.data.data);
      }
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
        setLoading(false);
      }
    }
  }, [authStore._id, dispatch, isMounted]);

  const getNotifications = useCallback(async () => {
    try {
      const res = await dispatch(getTenantActiveAudits(authStore._id));
      const temp = res.data.data.filter((e) => !e.readReceipt);
      if (isMounted()) {
        setNotificationCount(temp.length);
      }
    } catch (err) {
      handleErrorResponse(err);
    }
  }, [authStore._id, dispatch, isMounted]);

  useEffect(() => {
    // Subscribe for the focus Listener
    getListData();
    getNotifications();

    const unsubscribe = navigation.addListener("focus", () => {
      getListData();
      getNotifications();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getListData, getNotifications, navigation]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Dashboard"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <CenteredLoading loading={loading} />
      <Layout style={styles.layout}>
        <Divider />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          data={listData}
          renderItem={renderActiveAudits}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={handleRefreshList}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={() => (
            <View style={styles.textContainer}>
              <CustomText style={styles.text}>Outstanding Audits</CustomText>
            </View>
          )}
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
  badge: {
    position: "absolute",
    left: 0,
  },
  textContainer: {
    marginVertical: 20,
  },
  text: {
    fontSize: 26,
    fontFamily: "SFProDisplay-Bold",
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexGrow: 1,
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
