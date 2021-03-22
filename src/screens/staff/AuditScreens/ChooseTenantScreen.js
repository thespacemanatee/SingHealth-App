import React, { useState, useEffect, useCallback } from "react";
import { SectionList, View } from "react-native";
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
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as checklistActions from "../../../store/actions/checklistActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChooseTenantScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [sectionData, setSectionData] = useState([]);

  const dispatch = useDispatch();

  const theme = useTheme();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }) => {
      return (
        <View style={{ backgroundColor: theme["color-primary-300"] }}>
          <Text style={styles.header}>{title}</Text>
          <Divider />
        </View>
      );
    },
    [theme]
  );

  const renderSectionList = useCallback(
    (itemData) => {
      if (itemData.item.data) {
        const tenantID = Object.keys(itemData.item.data.chosen_tenant)[0];
        console.log(itemData.item.time);
        return (
          <Card
            style={styles.item}
            status="basic"
            onPress={() => {
              dispatch(checklistActions.addSavedChecklist(itemData.item.data));
              navigation.navigate("Checklist", {
                auditID: itemData.item.time,
                savedChecklist: itemData.item.data,
              });
            }}
          >
            <View>
              <Text>{itemData.item.data.chosen_tenant[tenantID].name}</Text>
              <Text>{itemData.item.time}</Text>
            </View>
          </Card>
        );
      }
      const tenantID = Object.keys(itemData.item)[0];
      return (
        <Card
          style={styles.item}
          status="basic"
          onPress={() => {
            const now = new Date().toISOString();
            dispatch(checklistActions.addAuditTenantSelection(itemData.item));
            navigation.navigate("Checklist", { auditID: now });
          }}
        >
          <Text>{itemData.item[tenantID].name}</Text>
        </Card>
      );
    },
    [dispatch, navigation]
  );

  const getSectionData = useCallback(async () => {
    const tempArray = [];
    Object.keys(databaseStore.tenants).forEach((key) => {
      if (
        databaseStore.tenants[key].institution ===
        databaseStore.current_institution
      ) {
        tempArray.push({ [key]: databaseStore.tenants[key] });
      }
    });
    let data = await AsyncStorage.getItem("savedChecklists");
    if (data !== null) {
      data = JSON.parse(data);
    }

    const tempChecklists = [
      {
        title: "Available Tenants",
        data: tempArray,
      },
      { title: "Saved Checklists", data: data ? Object.values(data) : [] },
    ];
    setSectionData(tempChecklists);
  }, [databaseStore.current_institution, databaseStore.tenants]);

  useEffect(() => {
    getSectionData();
  }, [getSectionData]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Tenant Selection"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.screen}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Choose a Tenant to Audit</Text>
        </View>
        <SectionList
          sections={sectionData}
          keyExtractor={(item, index) => item + index}
          renderItem={renderSectionList}
          contentContainerStyle={styles.contentContainer}
          renderSectionHeader={renderSectionHeader}
          SectionSeparatorComponent={() => <Divider />}
        />
      </Layout>
    </View>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    padding: 10,
    fontWeight: "bold",
  },
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
