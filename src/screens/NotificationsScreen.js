import React, { useState, useCallback } from "react";
import { View, Platform, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  StyleService,
  Icon,
  TopNavigationAction,
} from "@ui-kitten/components";
import useMountedState from "react-use/lib/useMountedState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../store/actions/databaseActions";
import * as checklistActions from "../store/actions/checklistActions";
import NotificationCard from "../components/NotificationCard";
import CenteredLoading from "../components/ui/CenteredLoading";
import { handleErrorResponse } from "../helpers/utils";
import SkeletonLoading from "../components/ui/loading/SkeletonLoading";
import CustomText from "../components/ui/CustomText";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const NotificationsScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const databaseStore = useSelector((state) => state.database);
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleNavigateRectifications = useCallback(
    async (auditID, stallName, navProps) => {
      try {
        setLoading(true);
        await dispatch(checklistActions.getAuditData(auditID));

        if (navProps.section) {
          navigation.navigate("RectificationDetails", navProps);
        } else {
          navigation.navigate("Rectification", { stallName });
        }
      } catch (err) {
        handleErrorResponse(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [dispatch, isMounted, navigation]
  );

  const renderNotifications = useCallback(
    (itemData) => {
      const { stallName } = itemData.item;
      let { message } = itemData.item;
      let headerText;
      if (authStore.userType === "staff") {
        headerText = `Stall: ${stallName}`;
        if (itemData.item.type === "patch") {
          message = `Tenant has updated rectifications for item ${
            message.index + 1
          } under ${message.section}.`;
        }
      } else if (itemData.item.type === "patch") {
        headerText = `Rectification was ${
          message.rectified ? "approved" : "revoked"
        }`;
        message = `Staff has ${
          message.rectified ? "approved" : "revoked"
        } rectifications for item ${message.index + 1} under ${
          message.section
        }.`;
      } else {
        headerText = "New Message";
      }

      return (
        <NotificationCard
          headerText={headerText}
          message={message}
          data={itemData.item}
          onPress={handleNavigateRectifications}
        />
      );
    },
    [authStore.userType, handleNavigateRectifications]
  );

  const getNotifications = useCallback(async () => {
    try {
      setListLoading(true);
      await dispatch(databaseActions.getNotifications(authStore._id));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setListLoading(false);
      }
    }
  }, [authStore._id, dispatch, isMounted]);

  const renderEmptyComponent = () =>
    listLoading ? (
      <SkeletonLoading />
    ) : (
      <View style={styles.emptyComponent}>
        <CustomText bold>NO NOTIFICATIONS</CustomText>
      </View>
    );

  useEffectOnce(() => {
    getNotifications();
  });

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Notifications"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <CenteredLoading loading={loading} />
        <FlatList
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={styles.contentContainer}
          renderItem={renderNotifications}
          data={databaseStore.notifications}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={getNotifications}
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
  button: {
    marginBottom: 10,
  },
  emptyComponent: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default NotificationsScreen;
