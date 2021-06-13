import React, { useState, useEffect, useCallback } from "react";
import { FlatList, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Layout, StyleService } from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useMountedState from "react-use/lib/useMountedState";
import { RefreshControl } from "react-native-web-refresh-control";

import * as checklistActions from "../../store/actions/checklistActions";
import SavedChecklistCard from "../../components/SavedChecklistCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import EntityLoading from "../../components/ui/loading/EntityLoading";

const ChooseTenantScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  const isMounted = useMountedState();

  const dispatch = useDispatch();

  const handleRefreshList = () => {
    getListData();
  };

  const handleDeleteSavedChecklist = useCallback(() => {
    getListData();
  }, [getListData]);

  const renderSaved = useCallback(
    (itemData) => {
      return (
        <SavedChecklistCard
          item={itemData.item}
          navigation={navigation}
          deleteSave={handleDeleteSavedChecklist}
          onLoading={setLoading}
        />
      );
    },
    [handleDeleteSavedChecklist, navigation]
  );

  const getListData = useCallback(async () => {
    try {
      setListLoading(true);

      let tempSaved = [];

      let data = await AsyncStorage.getItem("savedChecklists");

      if (data !== null) {
        data = JSON.parse(data);
        const savedChecklists = Object.values(data);

        if (savedChecklists.length > 0) {
          const final = savedChecklists.filter(
            (e) =>
              e.data.auditMetadata.institutionID === authStore.institutionID
          );
          if (final.length > 0) {
            tempSaved = final;
          }
        }
      }
      if (isMounted()) {
        setSaved(tempSaved);
      }
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
      }
    }
  }, [authStore.institutionID, isMounted]);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener("focus", () => {
      // setLoading(true);
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
        <CustomText bold>NO SAVED AUDITS AVAILABLE</CustomText>
      </View>
    );

  return (
    <>
      <CenteredLoading loading={loading} />
      <Layout style={styles.screen}>
        <View style={styles.titleContainer}>
          <CustomText style={styles.title}>Saved Audits</CustomText>
        </View>
        <FlatList
          data={saved}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderSaved}
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
    fontSize: 26,
    fontFamily: "SFProDisplay-Bold",
    flexShrink: 1,
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
