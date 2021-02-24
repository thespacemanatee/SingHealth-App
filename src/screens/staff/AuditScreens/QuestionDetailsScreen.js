import React, { useState, useEffect, useCallback } from "react";
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
} from "@ui-kitten/components";

import * as checklistActions from "../../../store/actions/checklistActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const QuestionDetailsScreen = ({ route, navigation }) => {
  const { index } = route.params;
  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

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
        <Text>{index}</Text>
      </Layout>
    </SafeAreaView>
  );
};

export default QuestionDetailsScreen;

const styles = StyleService.create({});
