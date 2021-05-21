import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View } from "react-native";
import { Layout, StyleService } from "@ui-kitten/components";
import useMountedState from "react-use/lib/useMountedState";
import { RefreshControl } from "react-native-web-refresh-control";

import * as checklistActions from "../../store/actions/checklistActions";
import NewChecklistCard from "../../components/NewChecklistCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import EntityLoading from "../../components/ui/loading/EntityLoading";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getRelevantTenants } from "../../features/database/databaseSlice";

const ChooseTenantScreen = ({ navigation }) => {
  const authStore = useAppSelector((state) => state.auth);
  const databaseStore = useAppSelector((state) => state.database);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const isMounted = useMountedState();

  const dispatch = useAppDispatch();

  const handleRefreshList = () => {
    getListData();
  };

  const renderTenants = useCallback(
    (itemData) => {
      return (
        <NewChecklistCard
          item={itemData.item}
          navigation={navigation}
          onLoading={setLoading}
          staffID={authStore._id}
          institutionID={authStore.institutionID}
        />
      );
    },
    [authStore._id, authStore.institutionID, navigation]
  );

  const getListData = useCallback(async () => {
    try {
      setListLoading(true);

      await dispatch(getRelevantTenants(authStore.institutionID));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
      }
    }
  }, [authStore.institutionID, dispatch, isMounted]);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener("focus", () => {
      getListData();
      setTimeout(() => {
        dispatch(checklistActions.resetChecklistStore());
      }, 500);
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [dispatch, getListData, navigation]);

  const renderEmptyComponent = () =>
    listLoading ? (
      <EntityLoading />
    ) : (
      <View style={styles.emptyComponent}>
        <CustomText bold>NO TENANTS AVAILABLE</CustomText>
      </View>
    );

  return (
    <>
      <CenteredLoading loading={loading} />
      <Layout style={styles.screen}>
        <View style={styles.titleContainer}>
          <CustomText bold style={styles.title}>
            Choose a Tenant to Audit
          </CustomText>
        </View>
        <FlatList
          data={databaseStore.relevantTenants}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderTenants}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={handleRefreshList}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      </Layout>
    </>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    padding: 10,
    fontWeight: "bold",
  },
  titleContainer: {
    margin: 20,
  },
  title: {
    fontSize: 20,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  emptyComponent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});

export default ChooseTenantScreen;
