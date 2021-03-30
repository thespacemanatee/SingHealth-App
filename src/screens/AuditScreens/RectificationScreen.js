import React, { useState, useEffect, useCallback } from "react";
import { View, SectionList } from "react-native";
import { useSelector } from "react-redux";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  Text,
  StyleService,
  useTheme,
} from "@ui-kitten/components";
import moment from "moment";

import alert from "../../components/CustomAlert";
import SectionHeader from "../../components/ui/SectionHeader";
import SkeletonLoading from "../../components/ui/SkeletonLoading";
import CenteredLoading from "../../components/ui/CenteredLoading";
import RectificationCard from "../../components/RectificationCard";

export const FNB_SECTION = "F&B Checklist";
export const NON_FNB_SECTION = "Non-F&B Checklist";
export const COVID_SECTION = "COVID-19 Checklist";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const RectificationScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [completeChecklist, setCompleteChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        alert(
          "Are you sure?",
          "Your progress will be lost if you go back. Consider saving first.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Confirm",
              onPress: () => {
                navigation.goBack();
              },
              style: "destructive",
            },
          ]
        );
      }}
    />
  );

  const onSubmitHandler = () => {
    alert("Confirm Submission", "Are you sure you want to submit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        // onPress: () => {
        //   navigation.navigate("AuditSubmit");
        // },
      },
    ]);
  };

  const handleOpenRectificationCard = (checked, deleted, data) => {
    if (!checked && !deleted) {
      navigation.navigate("RectificationDetails", data);
    }
  };

  const renderChosenChecklist = useCallback(
    (itemData) => {
      return (
        <RectificationCard
          index={itemData.index}
          question={itemData.item.question}
          answer={itemData.item.answer}
          section={itemData.section.title}
          onPress={handleOpenRectificationCard}
        />
      );
    },
    [navigation]
  );

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return <SectionHeader title={title} />;
  }, []);

  const createNewSections = useCallback(() => {
    const checklist = [
      {
        title:
          checklistStore.chosen_checklist_type === "fnb"
            ? FNB_SECTION
            : NON_FNB_SECTION,
        data: [],
      },
    ];

    let temp;
    temp = Object.keys(checklistStore.chosen_checklist.questions);
    temp.forEach((title) => {
      checklist.push({
        title,
        data: checklistStore.chosen_checklist.questions[title],
      });
    });

    checklist.push({ title: COVID_SECTION, data: [] });
    temp = Object.keys(checklistStore.covid19.questions);
    temp.forEach((title) => {
      checklist.push({
        title,
        data: checklistStore.covid19.questions[title],
      });
    });

    // console.log(checklist);
    setCompleteChecklist(checklist);
  }, [
    checklistStore.chosen_checklist.questions,
    checklistStore.chosen_checklist_type,
    checklistStore.covid19.questions,
  ]);

  useEffect(() => {
    createNewSections();
    setLoading(false);
  }, [createNewSections]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Rectification"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.screen}>
        <View
          style={[
            styles.titleContainer,
            { backgroundColor: theme["color-primary-400"] },
          ]}
        >
          <Text style={styles.title}>
            Audit: {checklistStore.chosen_tenant.stallName}
          </Text>
          <Text>
            {moment(checklistStore.auditMetadata.date)
              .toLocaleString()
              .split(" ")
              .slice(0, 5)
              .join(" ")}
          </Text>
        </View>
        <CenteredLoading loading={loading} />
        <SectionList
          sections={completeChecklist}
          keyExtractor={(item, index) => item + index}
          renderItem={renderChosenChecklist}
          initialNumToRender={40}
          renderSectionHeader={renderSectionHeader}
          SectionSeparatorComponent={() => <Divider />}
        />
        <View style={styles.bottomContainer}>
          <Button status="primary" onPress={onSubmitHandler}>
            SUBMIT
          </Button>
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
  bottomContainer: {
    flexDirection: "row-reverse",
    padding: 20,
    borderColor: "grey",
    borderTopWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
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
});

export default RectificationScreen;