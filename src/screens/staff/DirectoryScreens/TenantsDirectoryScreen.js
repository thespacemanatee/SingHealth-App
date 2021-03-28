import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
  List,
  Card,
  StyleService,
  useTheme,
} from "@ui-kitten/components";

import directoryStyles from "./StyleGuide";
import * as databaseActions from "../../../store/actions/databaseActions";
import * as authActions from "../../../store/actions/authActions";
import alert from "../../../components/CustomAlert";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const TenantsDirectoryScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [tenants, setTenants] = useState([]);

  const theme = useTheme();

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const renderInstitutions = useCallback(
    (itemData) => {
      return (
        <Card
          style={[
            directoryStyles.item,
            { backgroundColor: theme["color-info-100"] },
          ]}
          status="info"
          activeOpacity={0.5}
          onPress={() => {}}
        >
          <View>
            <Text style={directoryStyles.listContentText}>
              {itemData.item.stallName}
            </Text>
          </View>
        </Card>
      );
    },
    [theme]
  );

  const getTenants = useCallback(async () => {
    try {
      const res = await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );
      console.log("RESPONSE:", res.data);
    } catch (err) {
      handleErrorResponse(err);
    }
  }, [authStore.institutionID, dispatch]);

  useEffect(() => {
    getTenants();
  }, [getTenants]);

  return (
    <SafeAreaView style={styles.screen}>
      <TopNavigation
        title="Directory"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <List
          data={tenants}
          renderItem={renderInstitutions}
          contentContainerStyle={directoryStyles.contentContainer}
        />
      </Layout>
    </SafeAreaView>
  );
};

const handleErrorResponse = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data } = err.response;
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
    if (err.response.status === 403) {
      authActions.signOut();
    } else {
      switch (Math.floor(err.response.status / 100)) {
        case 4: {
          alert("Error", err.response.message);
          break;
        }
        case 5: {
          alert("Server Error", "Please contact your administrator.");
          break;
        }
        default: {
          alert("Request timeout", "Check your internet connection.");
          break;
        }
      }
    }
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

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
  },
});

export default TenantsDirectoryScreen;
