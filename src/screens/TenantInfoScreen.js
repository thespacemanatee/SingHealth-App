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

import Graph from "../components/ui/graph/Graph.tsx";
import * as databaseActions from "../store/actions/databaseActions";
import * as checklistActions from "../store/actions/checklistActions";
import ActiveAuditCard from "../components/ActiveAuditCard";
import CenteredLoading from "../components/ui/CenteredLoading";
import { handleErrorResponse } from "../helpers/utils";
import CustomText from "../components/ui/CustomText";
import SkeletonLoading from "../components/ui/SkeletonLoading";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const TenantInfoScreen = ({ route, navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState(false);
  const [listData, setListData] = useState([]);
  const { tenantID, stallName } = route.params;

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const handleOpenAudit = useCallback(
    async (auditID, name) => {
      try {
        setLoading(true);

        console.log("AuditID:", auditID);

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
      const res = await dispatch(databaseActions.getTenantAudits(tenantID));
      console.log(res);
      setListData(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [dispatch, tenantID]);

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
        title={stallName}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <Graph label="Average Scores" />
        <Divider />
        <View style={styles.textContainer}>
          <CustomText style={styles.text}>All Audits</CustomText>
        </View>
        <CenteredLoading loading={loading} />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          data={listData}
          renderItem={renderAudits}
          onRefresh={getListData}
          refreshing={listLoading}
          ListEmptyComponent={renderEmptyComponent}
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
  textContainer: {
    margin: 20,
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
