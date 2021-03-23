import React, { useState, useEffect, useCallback } from "react";
import { SectionList, View, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
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

import * as checklistActions from "../../../store/actions/checklistActions";
import SavedChecklistCard from "../../../components/SavedChecklistCard";
import NewChecklistCard from "../../../components/NewChecklistCard";
import alert from "../../../components/CustomAlert";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChooseTenantScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const [sectionData, setSectionData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleError = (err, retryFunction) => {
    alert("Request timeout", "Check your internet connection.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        style: "default",
        onPress: retryFunction,
      },
    ]);
  };

  const handleLoading = (load) => {
    setLoading(load);
  };

  const renderSectionList = useCallback(
    (itemData) => {
      if (itemData.item.data) {
        return (
          <SavedChecklistCard
            itemData={itemData}
            navigation={navigation}
            deleteSave={handleDeleteSavedChecklist}
            onError={handleError}
            onLoading={handleLoading}
          />
        );
      }

      return (
        <NewChecklistCard
          itemData={itemData}
          navigation={navigation}
          onError={handleError}
          onLoading={handleLoading}
        />
      );
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
    setLoading(false);
    setSectionData(tempChecklists);
  }, [databaseStore.current_institution, databaseStore.tenants]);

  useEffect(() => {
    // Subscribe for the focus Listener
    const unsubscribe = navigation.addListener("focus", () => {
      getSectionData();
      setTimeout(() => {
        dispatch(checklistActions.resetChecklistStore());
      }, 500);
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [dispatch, getSectionData, navigation]);

  if (loading) {
    return (
      <View style={styles.screen}>
        <TopNavigation
          title="Checklist"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout style={styles.layout}>
          <ActivityIndicator
            size="large"
            color={theme["color-primary-default"]}
          />
        </Layout>
      </View>
    );
  }

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
  layout: {
    flex: 1,
    justifyContent: "center",
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
});

export default ChooseTenantScreen;
