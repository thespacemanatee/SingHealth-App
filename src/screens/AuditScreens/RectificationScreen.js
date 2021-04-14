import React, { useState, useEffect, useCallback } from "react";
import { View, SectionList, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  useTheme,
} from "@ui-kitten/components";
import { Chip } from "react-native-paper";
import moment from "moment";
import Toast from "react-native-toast-message";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

import alert from "../../components/CustomAlert";
import SectionHeader from "../../components/ui/SectionHeader";
import CenteredLoading from "../../components/ui/CenteredLoading";
import RectificationCard from "../../components/RectificationCard";
import * as databaseActions from "../../store/actions/databaseActions";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";

export const FNB_SECTION = "F&B Checklist";
export const NON_FNB_SECTION = "Non-F&B Checklist";
export const COVID_SECTION = "COVID-19 Checklist";
export const COMPLIANT = "COMPLIANT";
export const NON_COMPLIANT = "NON_COMPLIANT";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const DownloadIcon = (props) => (
  <Icon {...props} name="cloud-download-outline" />
);

const RectificationScreen = ({ route, navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const checklistStore = useSelector((state) => state.checklist);
  const [completeChecklist, setCompleteChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [covid19Keys, setCovid19Keys] = useState(true);
  const [compliantFilter, setCompliantFilter] = useState(false);
  const [nonCompliantFilter, setNonCompliantFilter] = useState(false);

  const { stallName } = route.params;

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleCompliantFilter = () => {
    createNewSections(COMPLIANT);
    setCompliantFilter(true);
    setNonCompliantFilter(false);
  };

  const handleNonCompliantFilter = () => {
    createNewSections(NON_COMPLIANT);
    setNonCompliantFilter(true);
    setCompliantFilter(false);
  };

  const handleGoBack = () => {
    if (authStore.userType === "tenant") {
      alert(
        "Are you sure?",
        "Your progress will be lost if you go back. Consider submitting rectifications first.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => {
              if (Platform.OS === "web") {
                window.history.back();
              } else {
                navigation.goBack();
              }
            },
            style: "destructive",
          },
        ]
      );
    } else if (Platform.OS === "web") {
      window.history.back();
    } else {
      navigation.goBack();
    }
  };

  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={handleGoBack} />
  );

  const DownloadAction = () => (
    <TopNavigationAction icon={DownloadIcon} onPress={handleDownloadToEmail} />
  );

  const handleDownloadToEmail = () => {
    alert(
      "Confirmation",
      "Are you sure you want to download? The checklist will be sent to your email",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: downloadToEmail },
      ]
    );
  };

  const downloadToEmail = async () => {
    try {
      await dispatch(
        databaseActions.exportAndEmail(checklistStore.auditMetadata._id)
      );
      Toast.show({
        text1: "Success",
        text2: "Please check your email!",
      });
    } catch (err) {
      handleErrorResponse(err);
    }
  };

  const handleOpenRectificationCard = useCallback(
    (checked, deleted, params) => {
      if (!checked && !deleted) {
        navigation.navigate("RectificationDetails", params);
      }
    },
    [navigation]
  );

  const getItemLayout = sectionListGetItemLayout({
    getItemHeight: () => 120,
    getSectionHeaderHeight: () => 50,
  });

  const renderChosenChecklist = useCallback(
    (itemData) => {
      const checklistType = covid19Keys.includes(itemData.section.title)
        ? "covid19"
        : checklistStore.chosen_checklist_type;
      return (
        <RectificationCard
          index={itemData.item.index - 1}
          checklistType={checklistType}
          question={itemData.item.question}
          answer={itemData.item.answer}
          rectified={itemData.item.rectified}
          section={itemData.section.title}
          onPress={handleOpenRectificationCard}
        />
      );
    },
    [
      checklistStore.chosen_checklist_type,
      covid19Keys,
      handleOpenRectificationCard,
    ]
  );

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return <SectionHeader title={title} />;
  }, []);

  const createNewSections = useCallback(
    (filter) => {
      const checklist = [];

      const chosenKeys = Object.keys(checklistStore.chosen_checklist.questions);
      const covidKeys = Object.keys(checklistStore.covid19.questions);

      if (filter === NON_COMPLIANT) {
        chosenKeys.forEach((title) => {
          const temp = checklistStore.chosen_checklist.questions[title].filter(
            (e) => e.rectified !== undefined
          );
          if (temp.length > 0) {
            checklist.push({
              title,
              data: temp,
            });
          }
        });

        covidKeys.forEach((title) => {
          const temp = checklistStore.covid19.questions[title].filter(
            (e) => e.rectified !== undefined
          );
          if (temp.length > 0) {
            checklist.push({
              title,
              data: temp,
            });
          }
        });
      } else if (filter === COMPLIANT) {
        chosenKeys.forEach((title) => {
          const temp = checklistStore.chosen_checklist.questions[title].filter(
            (e) => e.rectified === undefined
          );
          if (temp.length > 0) {
            checklist.push({
              title,
              data: temp,
            });
          }
        });

        covidKeys.forEach((title) => {
          const temp = checklistStore.covid19.questions[title].filter(
            (e) => e.rectified === undefined
          );
          if (temp.length > 0) {
            checklist.push({
              title,
              data: temp,
            });
          }
        });
      } else {
        setCompliantFilter(false);
        setNonCompliantFilter(false);
        chosenKeys.forEach((title) => {
          checklist.push({
            title,
            data: checklistStore.chosen_checklist.questions[title],
          });
        });

        // checklist.push({ title: COVID_SECTION, data: [] });
        covidKeys.forEach((title) => {
          checklist.push({
            title,
            data: checklistStore.covid19.questions[title],
          });
        });
      }

      setCompleteChecklist(checklist);
    },
    [
      checklistStore.chosen_checklist.questions,
      checklistStore.covid19.questions,
    ]
  );

  useEffect(() => {
    createNewSections();
    setCovid19Keys(Object.keys(checklistStore.covid19.questions));
    setLoading(false);
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("UNSUBSCRIBING!!");
      createNewSections();
    });

    return () => {
      // Unsubscribe for the focus Listener
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [checklistStore.covid19.questions, createNewSections, navigation]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Rectification"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={DownloadAction}
      />
      <Divider />
      <Layout style={styles.screen}>
        <View
          style={[
            styles.titleContainer,
            { backgroundColor: theme["color-primary-400"] },
          ]}
        >
          <CustomText bold style={styles.title}>
            {stallName}
          </CustomText>
          <CustomText>
            {moment(checklistStore.auditMetadata.date.$date)
              .toLocaleString()
              .split(" ")
              .slice(0, 5)
              .join(" ")}
          </CustomText>
        </View>
        <CenteredLoading loading={loading} />
        <SectionList
          sections={completeChecklist}
          stickySectionHeadersEnabled
          keyExtractor={(item, index) => String(index)}
          renderItem={renderChosenChecklist}
          renderSectionHeader={renderSectionHeader}
          getItemLayout={getItemLayout}
        />
        <View style={styles.bottomContainer}>
          <Chip
            style={styles.chipContainer}
            icon="filter-outline"
            selected={compliantFilter}
            onPress={handleCompliantFilter}
            onClose={createNewSections}
          >
            Compliant
          </Chip>
          <Chip
            style={styles.chipContainer}
            icon="filter-outline"
            selected={nonCompliantFilter}
            onPress={handleNonCompliantFilter}
            onClose={createNewSections}
          >
            Non-Compliant
          </Chip>
        </View>
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
  titleContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  radioGroup: {
    paddingLeft: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "space-around",
  },
  errorText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: "row",
    padding: 10,
    borderColor: "grey",
    borderTopWidth: 1,
    // justifyContent: "space-between",
    alignItems: "center",
  },
  chipContainer: {
    margin: 5,
  },
});

export default RectificationScreen;
