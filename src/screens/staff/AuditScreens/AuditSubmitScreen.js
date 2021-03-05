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

  const submitHandler = async () => {
    const temp_chosen_checklist = { ...checklistStore.chosen_checklist };
    const temp_covid19_checklist = { ...checklistStore.covid19 };
    const chosen_tenant = Object.keys(checklistStore.chosen_tenant)[0];
    const chosen_checklist_type = checklistStore.chosen_checklist_type;
    let chosen_checklist_images = [];
    let covid19_checklist_images = [];

    const formData = new FormData();
    temp_chosen_checklist.questions.forEach((element, index) => {
      if (element.image) {
        element.image.forEach((image, index) => {
          const fileName = `${
            chosen_tenant + "_" + index + "_" + Date.now()
          }.jpg`;
          formData.append("images", {
            uri: image,
            name: fileName,
            type: "image/jpg",
          });
          chosen_checklist_images.push(fileName);
        });
        temp_chosen_checklist.questions[index].image = chosen_checklist_images;
        chosen_checklist_images = [];
      }
    });

    temp_covid19_checklist.questions.forEach((element, index) => {
      if (element.image) {
        element.forEach((image, index) => {
          const fileName = `${
            chosen_tenant + "_" + index + "_" + Date.now()
          }.jpg`;
          formData.append("images", {
            uri: image,
            name: fileName,
            type: "image/jpg",
          });
          covid19_checklist_images.push(fileName);
        });
        temp_covid19_checklist.questions[index].image = covid19_checklist_images;
        covid19_checklist_images = [];
      }
    });

    // console.log(temp_chosen_checklist);

    const audit_data = {
      auditMetadata: {
        staffID: "CGH_Staff1",
        tenantID: chosen_tenant,
        institutionID: "CGH",
        date: new Date().toISOString(),
      },
      auditForms: {
        [chosen_checklist_type]: temp_chosen_checklist,
        covid19: temp_covid19_checklist,
      },
    };

    // console.log(formData);
    console.log(audit_data);

    // setTimeout(() => {
    //   setSubmitting(false);
    // }, 2000);

    await fetch("http://localhost:5000/audits", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(audit_data),
    });

    await fetch("http://localhost:5000/images", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    setSubmitting(false);
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
