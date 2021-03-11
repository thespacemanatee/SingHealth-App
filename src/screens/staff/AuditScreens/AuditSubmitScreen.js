import React, { useState, useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Text,
  Button,
  Divider,
  Layout,
  StyleService,
  TopNavigation,
} from "@ui-kitten/components";
import axios from "axios";

import SuccessAnimation from "../../../components/ui/SuccessAnimation";
import CrossAnimation from "../../../components/ui/CrossAnimation";
import { CommonActions } from "@react-navigation/routers";
// import * as checklistActions from "../../../store/actions/checklistActions";

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();

  const submitHandler = async () => {
    setError(false);
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
            chosen_tenant +
            "_" +
            index +
            "_" +
            Math.round(Date.now() * Math.random())
          }.jpg`;
          if (Platform.OS === "web") {
          } else {
            formData.append("images", {
              uri: image,
              name: fileName,
              type: "image/jpg",
            });
          }
          chosen_checklist_images.push(fileName);
        });
        temp_chosen_checklist.questions[index].image = chosen_checklist_images;
        chosen_checklist_images = [];
      }
    });

    temp_covid19_checklist.questions.forEach((element, index) => {
      if (element.image) {
        element.image.forEach((image, index) => {
          const fileName = `${
            chosen_tenant +
            "_" +
            index +
            "_" +
            Math.round(Date.now() * Math.random())
          }.jpg`;
          if (Platform.OS === "web") {
          } else {
            formData.append("images", {
              uri: image,
              name: fileName,
              type: "image/jpeg",
            });
          }
          covid19_checklist_images.push(fileName);
        });
        temp_covid19_checklist.questions[
          index
        ].image = covid19_checklist_images;
        covid19_checklist_images = [];
      }
    });

    console.log(formData);

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

    // console.log(audit_data);

    let endpoint;

    if (Platform.OS === "android") {
      endpoint = "http://10.0.2.2:5000/";
    } else {
      endpoint = "http://localhost:5000/";
    }

    const post_audit = {
      url: `${endpoint}audits`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: audit_data,
    };

    const post_images = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data:
        Platform.OS === "android"
          ? formData._parts.length > 0
            ? formData
            : null
          : formData,
    };

    // axios(post_audit)
    //   .then((response) => {
    //     console.log(JSON.stringify(response));
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });

    axios
      .all([axios(post_audit), axios(post_images)])
      .then(
        axios.spread((req1, req2) => {
          console.log(req1.status, "req1");
          console.log(req2.status, "req2");
        })
      )
      .catch((error) => {
        setError(true);
        console.error(error);
      });

    setSubmitting(false);
  };

  useEffect(() => {
    submitHandler();
  }, [checklistStore]);

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
        <View style={{ height: 200, width: 200 }}>
          {submitting && <SuccessAnimation loading={submitting} />}
          {!submitting && !error && <SuccessAnimation loading={submitting} />}
          {!submitting && error && <CrossAnimation loading={submitting} />}
        </View>
        {!submitting && (
          <View>
            <Text style={{ fontWeight: "bold" }}>
              Audit submitted on: {new Date().toLocaleDateString()}
            </Text>
            <Button
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 1,
                    routes: [{ name: "StaffDashboard" }],
                  })
                );
              }}
            >
              GO HOME
            </Button>
          </View>
        )}
      </Layout>
    </View>
  );
};

const styles = StyleService.create({});

export default AuditSubmitScreen;
