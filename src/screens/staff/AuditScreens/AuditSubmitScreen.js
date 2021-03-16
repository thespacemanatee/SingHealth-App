import React, { useState, useEffect } from "react";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";
import {
  Text,
  Button,
  Divider,
  Layout,
  StyleService,
  TopNavigation,
} from "@ui-kitten/components";
import axios from "axios";

import { CommonActions } from "@react-navigation/routers";
import SuccessAnimation from "../../../components/ui/SuccessAnimation";
import CrossAnimation from "../../../components/ui/CrossAnimation";
// import * as checklistActions from "../../../store/actions/checklistActions";

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState(false);

  const submitHandler = async () => {
    setError(false);
    const tempChosenChecklist = { ...checklistStore.chosen_checklist };
    const tempCovid19Checklist = { ...checklistStore.covid19 };
    const chosenTenant = Object.keys(checklistStore.chosen_tenant)[0];
    const chosenChecklistType = checklistStore.chosen_checklist_type;
    let chosenChecklistImages = [];
    let covid19ChecklistImages = [];

    const formData = new FormData();
    const base64images = { images: [] };
    tempChosenChecklist.questions.forEach((element, index) => {
      if (element.image) {
        element.image.forEach((image, imageIndex) => {
          const fileName = `${`${chosenTenant}_${imageIndex}_${Math.round(
            Date.now() * Math.random()
          )}`}.jpg`;
          if (Platform.OS === "web") {
            base64images.images.push({ fileName, uri: image });
          } else {
            formData.append("images", {
              uri: image,
              name: fileName,
              type: "image/jpg",
            });
          }
          chosenChecklistImages.push(fileName);
        });
        tempChosenChecklist.questions[index].image = chosenChecklistImages;
        chosenChecklistImages = [];
      }
    });

    tempCovid19Checklist.questions.forEach((element, index) => {
      if (element.image) {
        element.image.forEach((image, imageIndex) => {
          const fileName = `${`${chosenTenant}_${imageIndex}_${Math.round(
            Date.now() * Math.random()
          )}`}.jpg`;
          if (Platform.OS === "web") {
            base64images.images.push({ fileName, uri: image });
          } else {
            formData.append("images", {
              uri: image,
              name: fileName,
              type: "image/jpeg",
            });
          }
          covid19ChecklistImages.push(fileName);
        });
        tempCovid19Checklist.questions[index].image = covid19ChecklistImages;
        covid19ChecklistImages = [];
      }
    });

    console.log(formData);

    const auditData = {
      auditMetadata: {
        staffID: "CGH_Staff1",
        tenantID: chosenTenant,
        institutionID: "CGH",
        date: new Date().toISOString(),
      },
      auditForms: {
        [chosenChecklistType]: tempChosenChecklist,
        covid19: tempCovid19Checklist,
      },
    };

    // console.log(audit_data);

    let endpoint;

    if (Platform.OS === "android") {
      endpoint = "http://10.0.2.2:5000/";
    } else {
      endpoint = "http://localhost:5000/";
    }

    const postAudit = {
      url: `${endpoint}audits`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: auditData,
    };

    const postImages = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
      data:
        Platform.OS === "android"
          ? formData._parts.length > 0
            ? formData
            : null
          : formData,
    };

    const postImagesWeb = {
      url: `${endpoint}images`,
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: base64images,
    };

    axios
      .all([
        axios(postAudit),
        axios(Platform.OS === "web" ? postImagesWeb : postImages),
      ])
      .then(
        axios.spread((req1, req2) => {
          console.log(req1.data, "req1");
          console.log(req2.data, "req2");
        })
      )
      .catch((err) => {
        setError(true);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(err.response.data);
          console.error(err.response.status);
          console.error(err.response.headers);
        } else if (err.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error(err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", err.message);
        }
        console.error(err.config);
      });

    setSubmitting(false);
  };

  useEffect(() => {
    submitHandler();
  }, [checklistStore]);

  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "StaffDashboard" }],
      })
    );
  };

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
            <Button onPress={handleGoHome}>GO HOME</Button>
          </View>
        )}
      </Layout>
    </View>
  );
};

const styles = StyleService.create({});

export default AuditSubmitScreen;
