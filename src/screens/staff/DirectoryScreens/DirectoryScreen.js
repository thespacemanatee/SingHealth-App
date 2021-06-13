import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, View } from "react-native";
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

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;

const DirectoryScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [listLoading, setListLoading] = useState(true);

  const isMounted = useMountedState();

  const dispatch = useDispatch();

  const DrawerAction = () => (
    <TopNavigationAction
      icon={DrawerIcon}
      onPress={() => {
        navigation.openDrawer();
      }}
    />
  );

  const handleRefreshList = () => {
    getInstitutions();
  };

  const handleNavigateTenants = useCallback(
    (institutionID, displayName) => {
      navigation.navigate("TenantsDirectory", {
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
      await dispatch(databaseActions.getInstitutions());
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
    <View style={styles.screen}>
      <TopNavigation
        title="Directory"
        alignment="center"
        accessoryLeft={DrawerAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <FlatList
          data={databaseStore.institutions}
          contentContainerStyle={styles.contentContainer}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderInstitutions}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={handleRefreshList}
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

export default DirectoryScreen;
