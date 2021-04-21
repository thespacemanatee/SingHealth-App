import React, { useState, useCallback } from "react";
import { View, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Layout, StyleService } from "@ui-kitten/components";
import moment from "moment";
import useMountedState from "react-use/lib/useMountedState";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { RefreshControl } from "react-native-web-refresh-control";

import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";
import * as databaseActions from "../../store/actions/databaseActions";
import * as checklistActions from "../../store/actions/checklistActions";
import NotificationCard from "../../components/NotificationCard";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { formatDuration, handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";

const UnreadScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const databaseStore = useSelector((state) => state.database);
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMounted = useMountedState();

  const dispatch = useDispatch();

  const handleNavigateRectifications = useCallback(
    async ({ _id, auditID, stallName, navProps, readReceipt }) => {
      try {
        setLoading(true);
        await dispatch(checklistActions.getAuditData(auditID));
        if (!readReceipt) {
          const options = {
            url: `${endpoint}notifications`,
            method: "patch",
            params: { notifID: _id },
          };

          await httpClient(options);
        }

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
      const {
        _id,
        auditDate,
        notiDate,
        stallName,
        readReceipt,
      } = itemData.item;
      let { message } = itemData.item;
      let headerText;
      if (authStore.userType === "staff") {
        headerText = stallName;
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
        headerText = "Message";
      }

      const starts = moment(notiDate.$date || notiDate);
      const duration = formatDuration(moment().diff(starts));

      return (
        <NotificationCard
          _id={_id}
          headerText={headerText}
          message={message}
          data={itemData.item}
          onPress={handleNavigateRectifications}
          duration={duration}
          readReceipt={readReceipt}
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

  const renderEmptyComponent = () => (
    <View style={styles.emptyComponent}>
      <CustomText bold>NO UNREAD NOTIFICATIONS</CustomText>
    </View>
  );

  useEffectOnce(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // setLoading(true);
      getNotifications();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  });

  return (
    <>
      <CenteredLoading loading={loading} />
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
    </>
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

export default UnreadScreen;
