import React, { useState, useEffect, useCallback, Fragment } from "react";
import { SafeAreaView, View, ImageBackground, SectionList } from "react-native";
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
} from "@ui-kitten/components";

import * as checklistActions from "../../../store/actions/checklistActions";
import QuestionCard from "../../../components/QuestionCard";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChecklistScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [completeChecklist, setCompleteChecklist] = useState([]);

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
      return <Text style={styles.header}>{title}</Text>;
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
  }, [selectedIndex, databaseStore]);

  // useEffect(() => {
  //   setCurrentScore(checklistStore.current_score);
  // }, [checklistStore.current_score]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
        }}
      >
        <View style={styles.titleContainer}>
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
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleService.create({
  titleContainer: {
    padding: 20,
    backgroundColor: "#FD8352",
  },
  title: {
    fontSize: 20,
  },
  radioGroup: {
    paddingLeft: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
    margin: 10,
  },
  bottomContainer: {
    padding: 20,
    borderColor: "grey",
    borderTopWidth: 1,
  },
});

export default ChecklistScreen;
