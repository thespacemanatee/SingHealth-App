import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { FlatList, Platform, View } from "react-native";
import {
  Divider,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  StyleService,
} from "@ui-kitten/components";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse } from "../../../helpers/utils";
import EntityCard from "../../../components/EntityCard";
import EntityLoading from "../../../components/ui/loading/EntityLoading";
import CustomText from "../../../components/ui/CustomText";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const DeleteTenantScreen = ({ navigation }) => {
  const [institutions, setInstitutions] = useState([]);
  const [listLoading, setListLoading] = useState(true);

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

  const handleNavigateTenants = useCallback(
    (institutionID, displayName) => {
      navigation.navigate("SelectDelete", {
        institutionID,
        displayName,
      });
    },
    [navigation]
  );

  const renderInstitutions = useCallback(
    (itemData) => {
      return (
        <EntityCard
          onPress={handleNavigateTenants}
          displayName={itemData.item.institutionName}
          _id={itemData.item.institutionID}
        />
      );
    },
    [handleNavigateTenants]
  );

  const getInstitutions = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await dispatch(databaseActions.getInstitutions());
      setInstitutions(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    getInstitutions();
    const unsubscribe = navigation.addListener("focus", () => {
      getInstitutions();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getInstitutions, navigation]);

  const renderEmptyComponent = () =>
    listLoading ? (
      <EntityLoading />
    ) : (
      <View style={styles.emptyComponent}>
        <CustomText bold>NO AVAILABLE INSTITUTIONS</CustomText>
      </View>
    );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Delete Tenant"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <FlatList
          data={institutions}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderInstitutions}
          refreshing={listLoading}
          onRefresh={getInstitutions}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={getInstitutions}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
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
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default DeleteTenantScreen;
