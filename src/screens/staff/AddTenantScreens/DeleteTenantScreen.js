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
import { SafeAreaView } from "react-native-safe-area-context";
import useMountedState from "react-use/lib/useMountedState";
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
          onPress={() => {
            handleNavigateTenants(
              itemData.item._id,
              itemData.item.institutionName
            );
          }}
          displayName={itemData.item.institutionName}
          image={itemData.item.image}
        />
      );
    },
    [handleNavigateTenants]
  );

  const getInstitutions = useCallback(async () => {
    try {
      setListLoading(true);

      const res = await dispatch(databaseActions.getInstitutions());
      if (isMounted()) {
        setInstitutions(res.data.data);
      }
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
      }
    }
  }, [dispatch, isMounted]);

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
    <SafeAreaView style={styles.screen}>
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
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={getInstitutions}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
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

export default DeleteTenantScreen;
