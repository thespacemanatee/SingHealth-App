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
  useStyleSheet,
} from "@ui-kitten/components";
import moment from "moment";
import { Badge } from "react-native-paper";
import useMountedState from "react-use/lib/useMountedState";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import ActiveAuditCard from "../../components/ActiveAuditCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import SkeletonLoading from "../../components/ui/loading/SkeletonLoading";
import useHandleScroll from "../../helpers/hooks/useHandleScroll";
import TimedGraph from "../../components/TimedGraph";
import AuditsHeader from "../../components/AuditsHeader";
import AnimatedFab from "../../components/ui/AnimatedFab";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const databaseStore = useSelector((state) => state.database);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [sortedListData, setSortedListData] = useState([]);
  const [orderedBy, setOrderedBy] = useState("Oldest");
  const [error, setError] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const { handleScroll, showButton } = useHandleScroll();

  const isMounted = useMountedState();

  const styles = useStyleSheet(themedStyles);

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
    [authStore.userType, handleOpenAudit, styles.item]
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
      await dispatch(
        databaseActions.getStaffActiveAudits(authStore.institutionID)
      );
      await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );
      await dispatch(databaseActions.getInstitutions());
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
        setLoading(false);
      }
    }
  }, [authStore.institutionID, dispatch, isMounted]);

  const getNotifications = useCallback(async () => {
    try {
      const res = await dispatch(
        databaseActions.getNotifications(authStore._id)
      );
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

  useEffect(() => {
    const temp = databaseStore.activeAudits
      ? [...databaseStore.activeAudits]
      : [];
    switch (orderedBy) {
      case "Oldest":
        setSortedListData(
          temp.sort((a, b) => {
            return a.auditMetadata.date.$date - b.auditMetadata.date.$date;
          })
        );
        break;

      case "Newest":
        setSortedListData(
          temp.sort((a, b) => {
            return b.auditMetadata.date.$date - a.auditMetadata.date.$date;
          })
        );
        break;

      case "Increasing Score":
        setSortedListData(
          temp.sort((a, b) => {
            return a.auditMetadata.score - b.auditMetadata.score;
          })
        );
        break;

      case "Decreasing Score":
        setSortedListData(
          temp.sort((a, b) => {
            return b.auditMetadata.score - a.auditMetadata.score;
          })
        );
        break;

      default:
        break;
    }
  }, [orderedBy, databaseStore.activeAudits]);

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
        <CenteredLoading loading={loading} />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          data={sortedListData}
          renderItem={renderActiveAudits}
          onScroll={handleScroll}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={handleRefreshList}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={
            <>
              <TimedGraph label="Average Scores (All Institutions)" />
              <AuditsHeader
                label="Rectification Progress"
                onOldestPress={(type) => setOrderedBy(type)}
                onNewestPress={(type) => setOrderedBy(type)}
                onIncreasingScorePress={(type) => setOrderedBy(type)}
                onDecreasingScorePress={(type) => setOrderedBy(type)}
              />
            </>
          }
        />

        <AnimatedFab
          icon="plus"
          label="New Audit"
          showLabel={showButton}
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

const themedStyles = StyleService.create({
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
