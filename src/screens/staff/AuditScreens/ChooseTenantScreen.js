import React, { useState, useEffect, useCallback } from "react";
import { SectionList, View } from "react-native";
import { useSelector } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  StyleService,
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SavedChecklistCard from "../../../components/SavedChecklistCard";
import NewChecklistCard from "../../../components/NewChecklistCard";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChooseTenantScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [sectionData, setSectionData] = useState([]);

  const theme = useTheme();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const handleDeleteSavedChecklist = useCallback(() => {
    getSectionData();
  }, [getSectionData]);

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
        return (
          <SavedChecklistCard
            itemData={itemData}
            navigation={navigation}
            deleteSave={handleDeleteSavedChecklist}
          />
        );
      }

      return <NewChecklistCard itemData={itemData} navigation={navigation} />;
    },
    [handleDeleteSavedChecklist, navigation]
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

    const tempChecklists = [
      {
        title: "Available Tenants",
        data: tempArray,
      },
    ];

    let data = await AsyncStorage.getItem("savedChecklists");
    if (data !== null) {
      data = JSON.parse(data);
      if (Object.keys(data).length > 0) {
        tempChecklists.push({
          title: "Saved Checklists",
          data: Object.values(data),
        });
      }
    }
    setSectionData(tempChecklists);
  }, [databaseStore.current_institution, databaseStore.tenants]);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener("focus", () => {
      getSectionData();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getSectionData, navigation]);

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
          // contentContainerStyle={styles.contentContainer}
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
