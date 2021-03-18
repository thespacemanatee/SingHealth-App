import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
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
          <Text>{itemData.item[Object.keys(itemData.item)[0]].name}</Text>
        </Card>
      );
    },
    [dispatch, navigation]
  );

  useEffect(() => {
    const tempArray = [];
    Object.keys(databaseStore.tenants).forEach((key) => {
      if (
        databaseStore.tenants[key].institution ===
        databaseStore.current_institution
      ) {
        tempArray.push({ [key]: databaseStore.tenants[key] });
      }
    });
    setRelevantTenants(tempArray);
  }, [databaseStore]);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation
        title="Tenant Selection"
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
    </View>
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
