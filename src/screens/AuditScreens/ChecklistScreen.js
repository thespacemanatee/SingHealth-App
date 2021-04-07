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
  StyleService,
  useTheme,
  CheckBox,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import sectionListGetItemLayout from "react-native-section-list-get-item-layout";

import QuestionCard from "../../components/QuestionCard";
import alert from "../../components/CustomAlert";
import SectionHeader from "../../components/ui/SectionHeader";
import CenteredLoading from "../../components/ui/CenteredLoading";
import CustomText from "../../components/ui/CustomText";

export const FNB_SECTION = "F&B Checklist";
export const NON_FNB_SECTION = "Non-F&B Checklist";
export const COVID_SECTION = "COVID-19 Checklist";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const SaveIcon = (props) => <Icon {...props} name="save-outline" />;

const ChecklistScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [completeChecklist, setCompleteChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [covid19Keys, setCovid19Keys] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  const { auditID, stallName } = route.params;

  const theme = useTheme();

  console.log(checklistStore);

  const onGroupCheckedChange = (checked) => {
    // console.log(completeChecklist);
    completeChecklist.map((e) => {
      if (e.data.length > 0) {
        const inner = e.data.map((i) => {
          // eslint-disable-next-line no-param-reassign
          i.answer = checked;
          return i;
        });
        e.data = inner;
      }
      return e;
    });
    // console.log(temp);
    setAllChecked(checked);
    updateGroup();
  };

  const updateGroup = () => {
    const someChecked = completeChecklist.some((e) =>
      e.data.some((i) => i.answer)
    );
    const everyChecked = completeChecklist.every((e) =>
      e.data.some((i) => i.answer)
    );

    if (someChecked && !everyChecked) {
      setAllChecked(true);
      setIndeterminate(true);
    } else if (!someChecked && !everyChecked) {
      setAllChecked(false);
      setIndeterminate(false);
    } else if (everyChecked) {
      setAllChecked(true);
      setIndeterminate(false);
    }
  };

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

  const saveChecklists = async () => {
    try {
      const toSave = {
        chosen_tenant: checklistStore.chosen_tenant,
        time: auditID,
        data: checklistStore,
      };

      const value = await AsyncStorage.getItem("savedChecklists");
      if (value === null) {
        AsyncStorage.setItem(
          "savedChecklists",
          JSON.stringify({ [auditID]: toSave })
        );
      } else {
        const temp = JSON.parse(value);
        temp[auditID] = toSave;
        AsyncStorage.setItem("savedChecklists", JSON.stringify(temp));
      }
    } catch (err) {
      alert("Saving failed", "Please try again!");
      setLoading(false);
    }
  };

  const handleSaveChecklist = () => {
    alert(
      "Save checklist",
      "Save progress your current progress. WARNING: un-submitted checklists will expire after a few days.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Save", onPress: saveChecklists },
      ]
    );
  };

  const onSubmitHandler = () => {
    alert("Confirm Submission", "Are you sure you want to submit?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        onPress: () => {
          navigation.navigate("AuditSubmit");
        },
      },
    ]);
  };

  const handleOpenQuestionCard = useCallback(
    (checked, deleted, data) => {
      if (!checked && !deleted) {
        navigation.navigate("QuestionDetails", data);
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
        <QuestionCard
          index={itemData.item.index - 1}
          checklistType={checklistType}
          question={itemData.item.question}
          answer={itemData.item.answer}
          section={itemData.section.title}
          onPress={handleOpenQuestionCard}
        />
      );
    },
    [checklistStore.chosen_checklist_type, covid19Keys, handleOpenQuestionCard]
  );

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return <SectionHeader title={title} />;
  }, []);

  const SaveAction = () => (
    <TopNavigationAction icon={SaveIcon} onPress={handleSaveChecklist} />
  );

  const createNewSections = useCallback(() => {
    const checklist = [];

    let temp;
    temp = Object.keys(checklistStore.chosen_checklist.questions);
    temp.forEach((title) => {
      checklist.push({
        title,
        data: checklistStore.chosen_checklist.questions[title],
      });
    });

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
    checklistStore.covid19.questions,
  ]);

  useEffect(() => {
    createNewSections();
    setCovid19Keys(Object.keys(checklistStore.covid19.questions));
    setLoading(false);
  }, [checklistStore.covid19.questions, createNewSections]);

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Checklist"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={SaveAction}
      />
      <Divider />
      <Layout style={styles.screen}>
        <View
          style={[
            styles.titleContainer,
            { backgroundColor: theme["color-primary-400"] },
          ]}
        >
          <CustomText style={styles.title}>Audit: {stallName}</CustomText>
          <CustomText>
            {moment(checklistStore.auditMetadata.date)
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
          SectionSeparatorComponent={() => <Divider />}
          extraData={allChecked}
          getItemLayout={getItemLayout}
          initialNumToRender={40}
          // maxToRenderPerBatch={40}
        />
        <View style={styles.bottomContainer}>
          <CheckBox
            style={styles.group}
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={onGroupCheckedChange}
          >
            {`${allChecked ? "Uncheck" : "Check"} All`}
          </CheckBox>
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
    flexDirection: "row",
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

export default ChecklistScreen;
