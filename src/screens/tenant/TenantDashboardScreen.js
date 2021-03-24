import React, { useEffect, useCallback, useState } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Icon,
  Layout,
  StyleService,
  Text,
  TopNavigation,
  TopNavigationAction,
  List,
  Card,
  useTheme,
} from "@ui-kitten/components";
import moment from "moment";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import * as databaseActions from "../../store/actions/databaseActions";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const StaffDashboardScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [listData, setListData] = useState([]);

  const theme = useTheme();

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

  const handleOpenAudit = () => {};

  const renderActiveAudits = useCallback(
    (itemData) => {
      const { item } = itemData;
      return (
        <Card
          style={{ backgroundColor: theme["color-info-100"] }}
          status="info"
          activeOpacity={0.5}
          onPress={handleOpenAudit}
        >
          <View style={styles.cardContainer}>
            <View style={{}}>
              <Text style={{ fontWeight: "bold" }}>
                {moment(item.date)
                  .toLocaleString()
                  .split(" ")
                  .slice(0, 5)
                  .join(" ")}
              </Text>
              <Text>{`You scored: ${item.score}`}</Text>
            </View>
            <View style={{}}>
              <AnimatedCircularProgress
                size={120}
                width={15}
                fill={
                  item.rectificationProgress ? item.rectificationProgress : 1
                }
                duration={2000}
                tintColor={theme["color-danger-600"]}
                tintColorSecondary={theme["color-info-500"]}
                backgroundColor="#3d5875"
              />
            </View>
          </View>
        </Card>
      );
    },
    [theme]
  );

  const getListData = useCallback(() => {
    dispatch(databaseActions.getTenantActiveAudits(authStore._id))
      .then((res) => {
        console.log(res);
        setListData(res.data.data);
      })
      .catch((err) => {
        handleErrorResponse(err);
      });
  }, [authStore._id, dispatch]);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener("focus", () => {
      getListData();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getListData, navigation]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Dashboard"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <View style={styles.textContainer}>
          <Text style={styles.text}>Outstanding Audits</Text>
        </View>
        <List
          contentContainerStyle={styles.contentContainer}
          data={listData}
          renderItem={renderActiveAudits}
        />
      </Layout>
    </View>
  );
};

const handleErrorResponse = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", err.message);
  }
  console.error(err.config);
};

export default StaffDashboardScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
  },
  textContainer: {
    margin: 20,
  },
  text: {
    fontSize: 26,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  listItemContainer: {},
});
