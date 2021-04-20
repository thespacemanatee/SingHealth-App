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
  useTheme,
} from "@ui-kitten/components";
import moment from "moment";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import useMountedState from "react-use/lib/useMountedState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { RefreshControl } from "react-native-web-refresh-control";

import * as databaseActions from "../store/actions/databaseActions";
import * as checklistActions from "../store/actions/checklistActions";
import NotificationCard from "../components/NotificationCard";
import CenteredLoading from "../components/ui/CenteredLoading";
import { formatDuration, handleErrorResponse } from "../helpers/utils";
import SkeletonLoading from "../components/ui/loading/SkeletonLoading";
import CustomText from "../components/ui/CustomText";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const { Navigator, Screen } = createMaterialTopTabNavigator();

const NotificationsScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const databaseStore = useSelector((state) => state.database);
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMounted = useMountedState();

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

  const Unread = () => {
    return (
      <Layout style={styles.layout}>
        <FlatList
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={styles.contentContainer}
          renderItem={renderNotifications}
          data={databaseStore.notifications.unread}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={getNotifications}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      </Layout>
    );
  };

  const Read = () => {
    return (
      <Layout style={styles.layout}>
        <FlatList
          keyExtractor={(item, index) => String(index)}
          contentContainerStyle={styles.contentContainer}
          renderItem={renderNotifications}
          data={databaseStore.notifications.read}
          refreshControl={
            <RefreshControl
              refreshing={listLoading}
              onRefresh={getNotifications}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
        />
      </Layout>
    );
  };

  const renderNotifications = useCallback(
    (itemData) => {
      const { auditDate, notiDate, stallName } = itemData.item;
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
      const starts = moment(notiDate.$date || notiDate);
      const duration = formatDuration(moment().diff(starts));
      console.log("DIFF TIME: ", duration);

      return (
        <NotificationCard
          headerText={headerText}
          message={message}
          data={itemData.item}
          onPress={handleNavigateRectifications}
          duration={duration}
        />
      );
    },
    [authStore.userType, handleNavigateRectifications]
  );

  const getNotifications = useCallback(async () => {
    try {
      setListLoading(true);
      const res = await dispatch(
        databaseActions.getNotifications(authStore._id)
      );
      console.log(res.data.data);
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
      <CenteredLoading loading={loading} />
      <Navigator
        initialRouteName="Unread"
        backBehavior="none"
        tabBarOptions={{
          labelStyle: { fontSize: 12, fontFamily: "SFProDisplay-Regular" },
          indicatorStyle: { backgroundColor: theme["color-primary-500"] },
        }}
      >
        <Screen
          name="Unread"
          component={Unread}
          options={{ tabBarLabel: "UNREAD" }}
        />
        <Screen
          name="Read"
          component={Read}
          options={{ tabBarLabel: "READ" }}
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
