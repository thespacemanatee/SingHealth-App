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

const DirectoryScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [institutions, setInstitutions] = useState([]);

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
        onPress={() => {
          navigation.navigate("TenantsDirectory", {
            chosenInstitution: itemData.item[0],
          });
        }}
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
    const tempArray = Object.entries(databaseStore.institutions);
    setInstitutions(tempArray);
  }, [databaseStore.institutions]);

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
          data={institutions}
          renderItem={renderInstitutions}
          contentContainerStyle={directoryStyles.contentContainer}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleService.create({});

export default DirectoryScreen;
