import React, { useState, useEffect, useCallback, Fragment } from "react";
import { SafeAreaView, View, ImageBackground } from "react-native";
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
  List,
  Radio,
  RadioGroup,
  CheckBox,
} from "@ui-kitten/components";

import * as checklistActions from "../../../store/actions/checklistActions";
import QuestionCard from "../../../components/QuestionCard";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ChecklistScreen = ({ navigation }) => {
  const databaseStore = useSelector((state) => state.database);
  const checklistStore = useSelector((state) => state.checklist);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [chosenChecklist, setChosenChecklist] = useState({});

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const renderChosenChecklist = useCallback((itemData) => {
    return (
      <QuestionCard
        itemData={itemData}
        index={itemData.index}
        navigation={navigation}
      />
    );
  }, []);

  useEffect(() => {
    if (selectedIndex == 0) {
      setChosenChecklist(databaseStore.audit_forms.fnb.questions);
      dispatch(
        checklistActions.addChosenChecklist(databaseStore.audit_forms.fnb)
      );
    } else {
      setChosenChecklist(databaseStore.audit_forms.non_fnb.questions);
      dispatch(
        checklistActions.addChosenChecklist(
          databaseStore.audit_forms.non_fnb.questions
        )
      );
    }
  }, [selectedIndex, databaseStore]);

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
        <List
          data={chosenChecklist}
          renderItem={renderChosenChecklist}
          initialNumToRender={40}
        />
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
});

export default ChecklistScreen;
