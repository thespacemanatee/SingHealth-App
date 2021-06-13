import React, { useState, useCallback, useEffect } from "react";
import { FlatList, Platform, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Icon,
  Layout,
  StyleService,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import moment from "moment";
import useMountedState from "react-use/lib/useMountedState";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../store/actions/databaseActions";
import * as checklistActions from "../store/actions/checklistActions";
import ActiveAuditCard from "../components/ActiveAuditCard";
import CenteredLoading from "../components/ui/CenteredLoading";
import { handleErrorResponse } from "../helpers/utils";
import CustomText from "../components/ui/CustomText";
import SkeletonLoading from "../components/ui/loading/SkeletonLoading";
import TimedGraph from "../components/TimedGraph";
import AuditsHeader from "../components/AuditsHeader";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const TenantInfoScreen = ({ route, navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState([]);
  const [sortedListData, setSortedListData] = useState([]);
  const [orderedBy, setOrderedBy] = useState("Oldest");
  const { tenantID, stallName } = route.params;

  const isMounted = useMountedState();

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          window.history.back();
        } else {
          navigation.goBack();
        }
      }}
    />
  );

  const handleOpenAudit = useCallback(
    async (auditID, name) => {
      try {
        setLoading(true);

        await dispatch(checklistActions.getAuditData(auditID));

        setLoading(false);
        navigation.navigate("Rectification", { stallName: name });
      } catch (err) {
        handleErrorResponse(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigation]
  );

  const renderAudits = useCallback(
    ({ item }) => {
      const { auditMetadata, stallName: name } = item;
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
            stallName={name}
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

      const res = await dispatch(databaseActions.getTenantAudits(tenantID));

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
  }, [dispatch, isMounted, tenantID]);

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

  useEffect(() => {
    const temp = listData ? [...listData] : [];
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
  }, [orderedBy, listData]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title={stallName}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <Divider />

        <CenteredLoading loading={loading} />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          data={sortedListData}
          renderItem={renderAudits}
          refreshControl={
            <RefreshControl refreshing={listLoading} onRefresh={getListData} />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={
            <>
              <TimedGraph label="Average Scores" type="tenant" id={tenantID} />
              <AuditsHeader
                label="All Audits"
                onOldestPress={(type) => setOrderedBy(type)}
                onNewestPress={(type) => setOrderedBy(type)}
                onIncreasingScorePress={(type) => setOrderedBy(type)}
                onDecreasingScorePress={(type) => setOrderedBy(type)}
              />
            </>
          }
        />
      </Layout>
    </View>
  );
};

export default TenantInfoScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
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
