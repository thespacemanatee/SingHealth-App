import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Platform, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RefreshControl } from "react-native-web-refresh-control";

import * as checklistActions from "../../store/actions/checklistActions";
import * as databaseActions from "../../store/actions/databaseActions";
import SavedChecklistCard from "../../components/SavedChecklistCard";
import NewChecklistCard from "../../components/NewChecklistCard";

import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import EntityLoading from "../../components/ui/loading/EntityLoading";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChooseTenantScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [tenants, setTenants] = useState([]);
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const { Navigator, Screen } = createMaterialTopTabNavigator();

  const theme = useTheme();

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

  const handleDeleteSavedChecklist = useCallback(() => {
    getListData();
  }, [getListData]);

  const renderTenants = useCallback(
    (itemData) => {
      return (
        <NewChecklistCard
          item={itemData.item}
          navigation={navigation}
          onError={handleErrorResponse}
          onLoading={setLoading}
          staffID={authStore._id}
          institutionID={authStore.institutionID}
        />
      );
    },
    [authStore._id, authStore.institutionID, navigation]
  );

  const renderSaved = useCallback(
    (itemData) => {
      return (
        <SavedChecklistCard
          item={itemData.item}
          navigation={navigation}
          deleteSave={handleDeleteSavedChecklist}
          onError={handleErrorResponse}
          onLoading={setLoading}
        />
      );
    },
    [handleDeleteSavedChecklist, navigation]
  );

  const getListData = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );

      // console.log(res.data.data);
      const tempTenants = res.data.data;

      setTenants(tempTenants);

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
      setSaved(tempSaved);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
      setLoading(false);
    }
  }, [authStore.institutionID, dispatch]);

  useEffect(() => {
    // Subscribe for the focus Listener
    getListData();
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
        <CustomText bold>NO TENANTS AVAILABLE</CustomText>
      </View>
    );

  const Tenants = () => {
    return (
      <Layout style={styles.screen}>
        <View style={styles.titleContainer}>
          <CustomText bold style={styles.title}>
            Choose a Tenant to Audit
          </CustomText>
        </View>
        <FlatList
          data={tenants}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderTenants}
          refreshing={listLoading}
          onRefresh={getListData}
          refreshControl={
            <RefreshControl refreshing={listLoading} onRefresh={getListData} />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      </Layout>
    );
  };

  const Saved = () => {
    return (
      <Layout style={styles.screen}>
        <View style={styles.titleContainer}>
          <CustomText bold style={styles.title}>
            Saved Checklists
          </CustomText>
        </View>
        <FlatList
          data={saved}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderSaved}
          refreshing={listLoading}
          onRefresh={getListData}
          refreshControl={
            <RefreshControl refreshing={listLoading} onRefresh={getListData} />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      </Layout>
    );
  };

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Tenant Selection"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <CenteredLoading loading={loading} />
      <Navigator
        initialRouteName="Tenants"
        backBehavior="none"
        tabBarOptions={{
          labelStyle: { fontSize: 12, fontFamily: "SFProDisplay-Regular" },
          indicatorStyle: { backgroundColor: theme["color-primary-500"] },
        }}
      >
        <Screen
          name="Tenants"
          component={Tenants}
          options={{ tabBarLabel: "Available" }}
        />
        <Screen
          name="Saved"
          component={Saved}
          options={{ tabBarLabel: "Saved" }}
        />
      </Navigator>
    </View>
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
    // flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default ChooseTenantScreen;
