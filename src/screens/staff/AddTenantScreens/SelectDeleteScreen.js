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
  Button,
} from "@ui-kitten/components";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse } from "../../../helpers/utils";
import EntityCard from "../../../components/EntityCard";
import EntityLoading from "../../../components/ui/loading/EntityLoading";
import CustomText from "../../../components/ui/CustomText";
import alert from "../../../components/CustomAlert";
import CenteredLoading from "../../../components/ui/CenteredLoading";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const SelectDeleteScreen = ({ route, navigation }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState(false);
  const { institutionID, displayName } = route.params;

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

  const handleDeleteTenant = () => {
    alert("Are you sure?", `Delete ${selectedTenant.name} from the database.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            const res = await dispatch(
              databaseActions.deleteTenant(selectedTenant.tenantID)
            );
            console.log(res);
          } catch (err) {
            handleErrorResponse(err);
          } finally {
            setLoading(false);
            setListLoading(true);
            getTenants();
          }
        },
      },
    ]);
  };

  const handleSelectTenant = useCallback((tenantID, name) => {
    setSelectedTenant({ tenantID, name });
  }, []);

  const renderTenants = useCallback(
    (itemData) => {
      return (
        <EntityCard
          onPress={handleSelectTenant}
          displayName={itemData.item.stallName}
          _id={itemData.item.tenantID}
        />
      );
    },
    [handleSelectTenant]
  );

  const getTenants = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await dispatch(
        databaseActions.getRelevantTenants(institutionID)
      );
      setTenants(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setListLoading(false);
    }
  }, [dispatch, institutionID]);

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
      <CenteredLoading loading={loading} />
      <Layout style={styles.layout}>
        <FlatList
          data={tenants}
          renderItem={renderTenants}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          refreshing={listLoading}
          onRefresh={getTenants}
          refreshControl={
            <RefreshControl refreshing={listLoading} onRefresh={getTenants} />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListHeaderComponent={
            <View style={styles.textContainer}>
              <CustomText style={styles.text}>Tenants</CustomText>
            </View>
          }
        />
        <View style={styles.buttonContainer}>
          <Button disabled={!selectedTenant} onPress={handleDeleteTenant}>
            DELETE TENANT
          </Button>
        </View>
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
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default SelectDeleteScreen;
