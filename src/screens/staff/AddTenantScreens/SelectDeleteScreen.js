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
import { SafeAreaView } from "react-native-safe-area-context";
import useMountedState from "react-use/lib/useMountedState";
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
  const { institutionID } = route.params;

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

  const handleDeleteTenant = () => {
    alert("Are you sure?", `Delete ${selectedTenant.name} from the database.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await dispatch(
              databaseActions.deleteTenant(selectedTenant.tenantID)
            );
            getTenants();
          } catch (err) {
            handleErrorResponse(err);
          } finally {
            if (isMounted()) {
              setLoading(false);
              setListLoading(true);
            }
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
          onPress={() => {
            handleSelectTenant(itemData.item.tenantID, itemData.item.stallName);
          }}
          displayName={itemData.item.stallName}
          image={itemData.item.image}
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
    <SafeAreaView style={styles.screen}>
      <TopNavigation
        title="Delete Tenants"
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
          refreshControl={
            <RefreshControl refreshing={listLoading} onRefresh={getTenants} />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
        <View style={styles.buttonContainer}>
          <Button
            style={styles.button}
            disabled={!selectedTenant}
            onPress={handleDeleteTenant}
          >
            DELETE TENANT
          </Button>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  layout: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    marginBottom: 10,
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

export default SelectDeleteScreen;
