import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  SectionList,
  ActivityIndicator,
  Platform,
} from "react-native";
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
  Radio,
  RadioGroup,
  useTheme,
} from "@ui-kitten/components";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as checklistActions from "../../../store/actions/checklistActions";
import QuestionCard from "../../../components/QuestionCard";
import alert from "../../../components/CustomAlert";

export const FNB_SECTION = "F&B Checklist";
export const NON_FNB_SECTION = "Non-F&B Checklist";
export const COVID_SECTION = "COVID-19 Checklist";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const SaveIcon = (props) => <Icon {...props} name="save-outline" />;

const ChecklistScreen = ({ route, navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completeChecklist, setCompleteChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const covid19Keys = Object.keys(databaseStore.audit_forms.covid19.questions);

  const { auditID } = route.params;

  const theme = useTheme();

  const dispatch = useDispatch();

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
      AsyncStorage.removeItem("savedChecklists");
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
    } catch (e) {
      // error reading value
      console.error(e);
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
          onPress: () => {
            navigation.navigate("AuditSubmit");
          },
        },
      ]);
    }
  };

  const renderChosenChecklist = useCallback(
    (itemData) => {
      // console.log(itemData.section);

      return (
        <QuestionCard
          index={itemData.index}
          question={itemData.item.question}
          section={itemData.section.title}
          navigation={navigation}
          covid19={covid19Keys.includes(itemData.section.title)}
        />
      );
    },
    [covid19Keys, navigation]
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

  const SaveAction = () => (
    <TopNavigationAction icon={SaveIcon} onPress={handleSaveChecklist} />
  );

  useEffect(() => {
    if (selectedIndex === 0) {
      dispatch(
        checklistActions.addChosenChecklist(
          checklistActions.TYPE_FNB,
          databaseStore.audit_forms.fnb
        )
      );
    } else {
      dispatch(
        checklistActions.addChosenChecklist(
          checklistActions.TYPE_NON_FNB,
          databaseStore.audit_forms.non_fnb
        )
      );
    }

    dispatch(
      checklistActions.addCovidChecklist(databaseStore.audit_forms.covid19)
    );

    const checklist = [
      {
        title: selectedIndex === 0 ? FNB_SECTION : NON_FNB_SECTION,
        data: [],
      },
    ];

    if (selectedIndex === 0) {
      const temp = Object.keys(databaseStore.audit_forms.fnb.questions);
      temp.forEach((title) => {
        checklist.push({
          title,
          data: databaseStore.audit_forms.fnb.questions[title],
        });
      });
    }
    if (selectedIndex === 1) {
      const temp = Object.keys(databaseStore.audit_forms.non_fnb.questions);
      temp.forEach((title) => {
        checklist.push({
          title,
          data: databaseStore.audit_forms.non_fnb.questions[title],
        });
      });
    }
    checklist.push({ title: COVID_SECTION, data: [] });
    const temp = Object.keys(databaseStore.audit_forms.covid19.questions);
    temp.forEach((title) => {
      checklist.push({
        title,
        data: databaseStore.audit_forms.covid19.questions[title],
      });
    });

    // console.log(checklist);

    setCompleteChecklist(checklist);

    setLoading(false);
  }, [selectedIndex, databaseStore, dispatch]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
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
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>
            Audit: {Object.values(checklistStore.chosen_tenant)[0].name}
          </Text>
          <Text>{new Date().toDateString()}</Text>
        </View>
        <RadioGroup
          selectedIndex={selectedIndex}
          onChange={(index) => setSelectedIndex(index)}
          style={styles.radioGroup}
        >
          <Radio>F&B</Radio>
          <Radio>Non-F&B</Radio>
        </RadioGroup>
        <SectionList
          sections={completeChecklist}
          keyExtractor={(item, index) => item + index}
          renderItem={renderChosenChecklist}
          initialNumToRender={40}
          renderSectionHeader={renderSectionHeader}
          SectionSeparatorComponent={() => <Divider />}
        />
        <View style={styles.bottomContainer}>
          {/* <Text>
            Current Score: {checklistStore.current_score}/
            {checklistStore.maximum_score}
          </Text> */}
          <Button
            //   style={styles.button}
            // appearance="filled"
            status="primary"
            onPress={onSubmitHandler}
          >
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
  header: {
    fontSize: 24,
    padding: 10,
    fontWeight: "bold",
  },
  bottomContainer: {
    flexDirection: "row-reverse",
    padding: 20,
    borderColor: "grey",
    borderTopWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ChecklistScreen;
