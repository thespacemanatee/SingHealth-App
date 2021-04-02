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
import { handleErrorResponse } from "../../../helpers/utils";

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
      setTenants(res.data.data);
    } catch (err) {
      handleErrorResponse(err);
    }
  }, [authStore.institutionID, dispatch]);

  useEffect(() => {
    getTenants();
  }, [getTenants]);

  return (
    <View style={styles.screen}>
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
});

export default TenantsDirectoryScreen;
