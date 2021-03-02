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

import { Styles as directoryStyles } from "../DirectoryScreens/StyleGuide";

const DrawerIcon = (props) => <Icon {...props} name="menu-outline" />;
const NotificationIcon = (props) => <Icon {...props} name="bell-outline" />;

const TenantsDirectoryScreen = ({ route, navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [tenants, setTenants] = useState([]);

  const { chosenInstitution } = route.params;

  const theme = useTheme();

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

  const renderInstitutions = useCallback((itemData) => {
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
  }, []);

  useEffect(() => {
    const tempArray = Object.entries(databaseStore.tenants);
    const newTempArray = tempArray.filter((e) => {
      return e[1].institution === chosenInstitution;
    });
    setTenants(newTempArray);
  }, [databaseStore.tenants]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="Directory"
        alignment="center"
        accessoryLeft={DrawerAction}
        accessoryRight={NotificationAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}
      >
        <List
          data={tenants}
          renderItem={renderInstitutions}
          contentContainerStyle={directoryStyles.contentContainer}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleService.create({});

export default TenantsDirectoryScreen;
