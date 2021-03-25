import React, { useState, useEffect, useCallback } from "react";
import { View, SectionList, Platform } from "react-native";
import { useSelector, useDispatch } from "react-redux";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import * as checklistActions from "../../../store/actions/checklistActions";
import QuestionCard from "../../../components/QuestionCard";
import alert from "../../../components/CustomAlert";
import { handleErrorResponse } from "../../../store/actions/authActions";
import SectionHeader from "../../../components/ui/SectionHeader";
import SkeletonLoading from "../../../components/ui/SkeletonLoading";
import CenteredLoading from "../../../components/ui/CenteredLoading";

export const FNB_SECTION = "F&B Checklist";
export const NON_FNB_SECTION = "Non-F&B Checklist";
export const COVID_SECTION = "COVID-19 Checklist";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const SaveIcon = (props) => <Icon {...props} name="save-outline" />;
const RetryIcon = (props) => <Icon {...props} name="refresh-outline" />;

const RectificationScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [completeChecklist, setCompleteChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log(checklistStore.chosen_checklist_type);

  // const { type } = route.params;
  const { auditID } = route.params;
  const tenant = checklistStore.chosen_tenant;

  const dispatch = useDispatch();

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

  const loadForm = async (index) => {
    try {
      const checklistType = index === 0 ? "fnb" : "non_fnb";
      setError(false);
      // setErrorMsg("");
      setLoading(true);
      await dispatch(checklistActions.getChecklist(checklistType, tenant));
      // .then(() => {
      createNewSections();
      setLoading(false);
    } catch (err) {
      handleErrorResponse(err);
      setError(err.message);
      // setErrorMsg(err.message);
      setLoading(false);
    }
  };

  const saveChecklists = async () => {
    try {
      // AsyncStorage.removeItem("savedChecklists");
      const toSave = {
        chosen_tenant: checklistStore.chosen_tenant,
        time: auditID,
        data: checklistStore,
      };

      const value = await AsyncStorage.getItem("savedChecklists");
      if (value === null) {
        // value previously stored
        AsyncStorage.setItem(
          "savedChecklists",
          JSON.stringify({ [auditID]: toSave })
        );
      } else {
        const temp = JSON.parse(value);
        temp[auditID] = toSave;
        // console.log(temp);
        AsyncStorage.setItem("savedChecklists", JSON.stringify(temp));
      }
    } catch (err) {
      // error reading value
      handleErrorResponse(err);
      setError(err.message);
      // setErrorMsg(err.message);
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
    if (Platform.OS === "web") {
      navigation.navigate("AuditSubmit");
    } else {
      alert("Confirm Submission", "Are you sure you want to submit?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          // onPress: () => {
          //   navigation.navigate("AuditSubmit");
          // },
        },
      ]);
    }
  };

  const renderChosenChecklist = useCallback(
    (itemData) => {
      return (
        <QuestionCard
          index={itemData.index}
          question={itemData.item.question}
          answer={itemData.item.answer}
          section={itemData.section.title}
          navigation={navigation}
          rectify
        />
      );
    },
    [navigation]
  );

  const renderSectionHeader = useCallback(({ section: { title } }) => {
    return <SectionHeader title={title} />;
  }, []);

  const SaveAction = () => (
    <TopNavigationAction icon={SaveIcon} onPress={handleSaveChecklist} />
  );

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

  // if (loa

  if (error) {
    return (
      <View style={styles.screen}>
        <TopNavigation
          title="Rectification"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout style={styles.layout}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <View>
              <Button
                accessoryLeft={RetryIcon}
                onPress={() => {
                  loadForm();
                }}
              >
                Retry
              </Button>
            </View>
          </View>
        </Layout>
      </View>
    );
  }

  const LoadingComponent = () => {
    return Platform.OS === "web" ? <CenteredLoading /> : <SkeletonLoading />;
  };

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Rectification"
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
        {!loading ? (
          <>
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
          </>
        ) : (
          <LoadingComponent />
        )}
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
