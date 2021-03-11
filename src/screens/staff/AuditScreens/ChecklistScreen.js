import React, { useState, useEffect, useCallback, Fragment } from "react";
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
  Card,
  StyleService,
  Radio,
  RadioGroup,
  useTheme,
} from "@ui-kitten/components";

import * as checklistActions from "../../../store/actions/checklistActions";
import QuestionCard from "../../../components/QuestionCard";
import alert from "../../../components/CustomAlert";

export const FNB_SECTION = "F&B Checklist";
export const NON_FNB_SECTION = "Non-F&B Checklist";
export const COVID_SECTION = "COVID-19 Checklist";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChecklistScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completeChecklist, setCompleteChecklist] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(checklistStore);

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

  const onSubmitHandler = () => {
    if (Platform.OS === "web") {
      navigation.navigate("AuditSubmit");
    } else {
      alert("Confirm Submission", "Are you sure you want to submit?", [
        { text: "Cancel" },
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
          itemData={itemData}
          index={itemData.index}
          navigation={navigation}
        />
      );
    },
    [selectedIndex]
  );

  const renderSectionHeader = useCallback(
    ({ section: { title } }) => {
      return (
        <Text
          style={[
            styles.header,
            { backgroundColor: theme["color-primary-300"] },
          ]}
        >
          {title}
        </Text>
      );
    },
    [selectedIndex]
  );

  useEffect(() => {
    if (selectedIndex == 0) {
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
        data:
          selectedIndex === 0
            ? databaseStore.audit_forms.fnb.questions
            : databaseStore.audit_forms.non_fnb.questions,
      },
      {
        title: COVID_SECTION,
        data: databaseStore.audit_forms.covid19.questions,
      },
    ];
    setCompleteChecklist(checklist);

    let max = 0;
    checklist.forEach((section) => {
      max += section.data.length;
    });
    dispatch(checklistActions.setMaximumScore(max));
    setLoading(false);
  }, [selectedIndex, databaseStore]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TopNavigation
          title="Checklist"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout
          style={{
            flex: 1,
            justifyContent: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={theme["color-primary-default"]}
          />
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation
        title="Checklist"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}
      >
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
        />
        <View style={styles.bottomContainer}>
          <Text>
            Current Score: {checklistStore.current_score}/
            {checklistStore.maximum_score}
          </Text>
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
    fontSize: 32,
    padding: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    padding: 20,
    borderColor: "grey",
    borderTopWidth: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default ChecklistScreen;
