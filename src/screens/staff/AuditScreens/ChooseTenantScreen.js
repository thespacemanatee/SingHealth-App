import React, { useState, useEffect, useCallback } from "react";
import { SectionList, View, Platform } from "react-native";
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
import * as databaseActions from "../../../store/actions/databaseActions";
import SavedChecklistCard from "../../../components/SavedChecklistCard";
import NewChecklistCard from "../../../components/NewChecklistCard";
import alert from "../../../components/CustomAlert";
import * as authActions from "../../../store/actions/authActions";
import SkeletonLoading from "../../../components/ui/SkeletonLoading";
import CenteredLoading from "../../../components/ui/CenteredLoading";

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
        />
      );
    },
    [handleDeleteSavedChecklist, navigation]
  );

  const getSectionData = useCallback(async () => {
    try {
      const res = await dispatch(
        databaseActions.getRelevantTenants(authStore.institutionID)
      );

      console.log(res.data);
      const tempChecklists = [
        {
          title: "Available Tenants",
          data: res.data,
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
      setLoading(true);
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

  const LoadingComponent = () => {
    return Platform.OS === "web" ? <CenteredLoading /> : <SkeletonLoading />;
  };

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
        {!loading ? (
          <SectionList
            sections={sectionData}
            keyExtractor={(item, index) => item + index}
            renderItem={renderSectionList}
            // contentContainerStyle={styles.contentContainer}
            renderSectionHeader={renderSectionHeader}
            SectionSeparatorComponent={() => <Divider />}
          />
        ) : (
          <LoadingComponent />
        )}
      </Layout>
    </View>
  );
};

const handleErrorResponse = (err) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data } = err.response;
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
    if (data.status === 403) {
      authActions.signOut();
    } else {
      switch (Math.floor(data.status / 100)) {
        case 4: {
          alert("Error", "Input error.");
          break;
        }
        case 5: {
          alert("Server Error", "Please contact your administrator.");
          break;
        }
        default: {
          alert("Request timeout", "Check your internet connection.");
          break;
        }
      }
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error(err.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error", err.message);
  }
  console.error(err.config);
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
