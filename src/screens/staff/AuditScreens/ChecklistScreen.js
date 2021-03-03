import React, { useState, useEffect, useCallback, Fragment } from "react";
import {
  SafeAreaView,
  View,
  SectionList,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { CommonActions } from "@react-navigation/native";
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

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChecklistScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completeChecklist, setCompleteChecklist] = useState([]);
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

  const renderChosenChecklist = useCallback(
    (itemData) => {
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
          "fnb",
          databaseStore.audit_forms.fnb
        )
      );
    } else {
      dispatch(
        checklistActions.addChosenChecklist(
          "non-fnb",
          databaseStore.audit_forms.non_fnb
        )
      );
    }
    const checklist = [
      {
        title: selectedIndex === 0 ? "F&B Checklist" : "Non-F&B Checklist",
        data:
          selectedIndex === 0
            ? databaseStore.audit_forms.fnb.questions
            : databaseStore.audit_forms.non_fnb.questions,
      },
      {
        title: "COVID-19 Checklist",
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
            Audit: {checklistStore.chosen_tenant.name}
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
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [{ name: "StaffDashboard" }],
                })
              );
            }}
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
