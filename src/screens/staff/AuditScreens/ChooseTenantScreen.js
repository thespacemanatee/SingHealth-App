import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView, View, ImageBackground } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  Card,
  StyleService,
  List,
} from "@ui-kitten/components";

import * as checklistActions from "../../../store/actions/checklistActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChooseTenantScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [relevantTenants, setRelevantTenants] = useState([]);

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const renderRelevantTenants = useCallback(
    (itemData) => {
      return (
        <Card
          style={styles.item}
          status="basic"
          onPress={() => {
            dispatch(checklistActions.addAuditTenantSelection(itemData.item));
            navigation.navigate("Checklist");
          }}
        >
          <Text>{itemData.item.name}</Text>
        </Card>
      );
    },
    [relevantTenants]
  );

  useEffect(() => {
    const tempArray = [];
    Object.keys(databaseStore.tenants).forEach(function (key) {
      if (
        databaseStore.tenants[key].institution ==
        databaseStore.current_institution
      ) {
        tempArray.push(databaseStore.tenants[key]);
      }
    });
    setRelevantTenants(tempArray);
  }, [databaseStore]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a Tenant to Audit</Text>
        </View>
        <List
          data={relevantTenants}
          renderItem={renderRelevantTenants}
          contentContainerStyle={styles.contentContainer}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleService.create({
  titleContainer: {
    margin: 20,
  },
  title: {
    fontSize: 20,
  },
  contentContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  item: {
    marginVertical: 4,
  },
});

export default ChooseTenantScreen;