import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  List,
  StyleService,
} from "@ui-kitten/components";

import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse } from "../../../helpers/utils";
import EntityCard from "../../../components/EntityCard";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const TenantsDirectoryScreen = ({ route, navigation }) => {
  const [tenants, setTenants] = useState([]);
  const { institutionID } = route.params;

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const renderTenants = useCallback((itemData) => {
    return (
      <EntityCard
        onPress={{}}
        displayName={itemData.item.stallName}
        _id={itemData.item.tenantID}
      />
    );
  }, []);

  const getTenants = useCallback(async () => {
    try {
      const res = await dispatch(
        databaseActions.getRelevantTenants(institutionID)
      );
      setTenants(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    }
  }, [dispatch, institutionID]);

  useEffect(() => {
    getTenants();
  }, [getTenants]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Directory"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <List data={tenants} renderItem={renderTenants} />
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
});

export default TenantsDirectoryScreen;
