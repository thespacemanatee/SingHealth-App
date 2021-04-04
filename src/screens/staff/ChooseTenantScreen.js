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
  StyleService,
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as checklistActions from "../../store/actions/checklistActions";
import * as databaseActions from "../../store/actions/databaseActions";
import SavedChecklistCard from "../../components/SavedChecklistCard";
import NewChecklistCard from "../../components/NewChecklistCard";
// import SkeletonLoading from "../../../components/ui/SkeletonLoading";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChooseTenantScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
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

  const renderSectionList = useCallback(
    (itemData) => {
      if (itemData.item.data) {
        return (
          <SavedChecklistCard
            item={itemData.item}
            navigation={navigation}
            deleteSave={handleDeleteSavedChecklist}
            onError={handleErrorResponse}
            onLoading={setLoading}
          />
        );
      }

      return (
        <NewChecklistCard
          item={itemData.item}
          navigation={navigation}
          onError={handleErrorResponse}
          onLoading={setLoading}
          staffID={authStore._id}
          institutionID={authStore.institutionID}
        />
      );
    },
    [
      authStore._id,
      authStore.institutionID,
      handleDeleteSavedChecklist,
      navigation,
    ]
  );

  const getSectionData = useCallback(async () => {
    try {
      const res = await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );

      // console.log(res.data.data);
      const tempChecklists = [
        {
          title: "Available Tenants",
          data: res.data.data,
        },
      ];

      let data = await AsyncStorage.getItem("savedChecklists");

      if (data !== null) {
        data = JSON.parse(data);
        const savedChecklists = Object.values(data);

        if (savedChecklists.length > 0) {
          const final = savedChecklists.filter(
            (e) =>
              e.data.auditMetadata.institutionID === authStore.institutionID
          );
          if (final.length > 0) {
            tempChecklists.push({
              title: "Saved Checklists",
              data: final,
            });
          }
        }
      }
      setSectionData(tempChecklists);
      setLoading(false);
    } catch (err) {
      handleErrorResponse(err);
      setLoading(false);
    }
  }, [authStore.institutionID, dispatch]);

  useEffect(() => {
    // Subscribe for the focus Listener
    getSectionData();
    const unsubscribe = navigation.addListener("focus", () => {
      // setLoading(true);
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
        <CenteredLoading loading={loading} />
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
