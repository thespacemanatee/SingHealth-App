import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
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
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const DirectoryScreen = ({ navigation }) => {
  const [institutions, setInstitutions] = useState([]);
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

  const NotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} onPress={() => {}} />
  );

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
    <View style={styles.screen}>
      <TopNavigation
        title="Directory"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
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
});

export default DirectoryScreen;
