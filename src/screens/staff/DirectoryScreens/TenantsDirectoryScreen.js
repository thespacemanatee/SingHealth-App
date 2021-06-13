import React, { useState, useEffect, useCallback } from "react";
import { FlatList, Platform, View } from "react-native";
import { useDispatch } from "react-redux";
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  StyleService,
} from "@ui-kitten/components";
import useMountedState from "react-use/lib/useMountedState";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse } from "../../../helpers/utils";
import EntityCard from "../../../components/EntityCard";
import EntityLoading from "../../../components/ui/loading/EntityLoading";
import CustomText from "../../../components/ui/CustomText";
import TimedGraph from "../../../components/TimedGraph";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const TenantsDirectoryScreen = ({ route, navigation }) => {
  const [tenants, setTenants] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const { institutionID, displayName } = route.params;

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

  const handleOpenTenant = useCallback(
    (tenantID, stallName) => {
      navigation.navigate("TenantInfo", { tenantID, stallName });
    },
    [navigation]
  );

  const renderTenants = useCallback(
    (itemData) => {
      return (
        <EntityCard
          onPress={() => {
            handleOpenTenant(itemData.item.tenantID, itemData.item.stallName);
          }}
          displayName={itemData.item.stallName}
          image={itemData.item.image}
        />
      );
    },
    [handleOpenTenant]
  );

  const getTenants = useCallback(async () => {
    try {
      setListLoading(true);

      const res = await dispatch(
        databaseActions.getRelevantTenants(institutionID)
      );
      if (isMounted()) {
        setTenants(res.data.data);
      }
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
      }
    }
  }, [dispatch, institutionID, isMounted]);

  useEffect(() => {
    getTenants();
  }, [getTenants]);

  const renderEmptyComponent = () =>
    listLoading ? (
      <EntityLoading />
    ) : (
      <View style={styles.emptyComponent}>
        <CustomText bold>NO TENANTS</CustomText>
      </View>
    );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title={displayName}
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <FlatList
          data={tenants}
          renderItem={renderTenants}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          refreshControl={
            <RefreshControl refreshing={listLoading} onRefresh={getTenants} />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={
            <>
              <TimedGraph
                label={`Average Scores (${displayName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")})`}
                type="institution"
                id={institutionID}
              />
              <View style={styles.textContainer}>
                <CustomText style={styles.text}>Tenants</CustomText>
              </View>
            </>
          }
        />
      </Layout>
    </View>
  );
};

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
    // flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  emptyComponent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
});

export default TenantsDirectoryScreen;
