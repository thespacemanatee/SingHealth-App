import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Divider,
  Layout,
  StyleService,
  TopNavigation,
} from "@ui-kitten/components";

import SuccessAnimation from "../../../components/ui/SuccessAnimation";
// import * as checklistActions from "../../../store/actions/checklistActions";

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const dispatch = useDispatch();

  const submitHandler = () => {
    setTimeout(() => {
      setSubmitting(false);
    }, 2000);
  };

  useEffect(() => {
    submitHandler();
  }, [checklistStore]);

  const renderSuccessAnimation = useCallback(() => {
    // console.log(submitting);
    return <SuccessAnimation loop={submitting} loading={submitting} />;
  }, [submitting]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TopNavigation title="SingHealth" alignment="center" />
      <Divider />
      <Layout
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderSuccessAnimation()}
      </Layout>
    </View>
  );
};

const styles = StyleService.create({});

export default AuditSubmitScreen;
