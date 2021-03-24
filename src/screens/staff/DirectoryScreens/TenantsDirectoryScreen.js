import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View } from "react-native";
import { useSelector } from "react-redux";
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

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const TenantsDirectoryScreen = ({ route, navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [tenants, setTenants] = useState([]);

  const { chosenInstitution } = route.params;

  const theme = useTheme();

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
              {itemData.item[1].name}
            </Text>
          </View>
        </Card>
      );
    },
    [theme]
  );

  useEffect(() => {
    const tempArray = Object.entries(databaseStore.tenants);
    const newTempArray = tempArray.filter((e) => {
      return e[1].institution === chosenInstitution;
    });
    setTenants(newTempArray);
  }, [chosenInstitution, databaseStore.tenants]);

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

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
  },
});

export default TenantsDirectoryScreen;
