import React, { useState, useEffect, useCallback } from "react";
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
import _ from "lodash";

import { CommonActions } from "@react-navigation/routers";
import SuccessAnimation from "../../../components/ui/SuccessAnimation";
import CrossAnimation from "../../../components/ui/CrossAnimation";
// import * as checklistActions from "../../../store/actions/checklistActions";

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState(false);

  const submitHandler = useCallback(async () => {
    setError(false);
    const tempChosenChecklist = _.cloneDeep(checklistStore.chosen_checklist);
    const tempCovid19Checklist = _.cloneDeep(checklistStore.covid19);
    const chosenTenant = checklistStore.chosen_tenant.tenantID;
    const chosenChecklistType = checklistStore.chosen_checklist_type;
    let chosenChecklistImages = [];
    let covid19ChecklistImages = [];
    let imageAdded = false;

    const formData = new FormData();
    const base64images = { images: [] };
    const chosenKeys = Object.keys(checklistStore.chosen_checklist.questions);
    chosenKeys.forEach((section) => {
      tempChosenChecklist.questions[section].forEach((element, index) => {
        if (element.answer !== false) {
          // eslint-disable-next-line no-param-reassign
          delete element.deadline;
        }
        if (element.image) {
          imageAdded = true;
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
          tempChosenChecklist.questions[section][
            index
          ].image = chosenChecklistImages;
          chosenChecklistImages = [];
        }
      });
    });
    console.log(tempChosenChecklist);

    const covid19Keys = Object.keys(checklistStore.covid19.questions);
    covid19Keys.forEach((section) => {
      tempCovid19Checklist.questions[section].forEach((element, index) => {
        if (element.image) {
          imageAdded = true;
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
          tempCovid19Checklist.questions[section][
            index
          ].image = covid19ChecklistImages;
          covid19ChecklistImages = [];
        }
      });
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
      data: imageAdded ? formData : null,
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

    const handleErrorResponse = (err) => {
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
    };

    if (imageAdded) {
      Promise.all([
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
          handleErrorResponse(err);
        });
    } else {
      axios(postAudit)
        .then((req) => {
          console.log(req.data, "req");
        })
        .catch((err) => {
          handleErrorResponse(err);
        });
    }

    setSubmitting(false);
  }, [
    checklistStore.chosen_checklist,
    checklistStore.chosen_checklist_type,
    checklistStore.chosen_tenant,
    checklistStore.covid19,
  ]);

  useEffect(() => {
    submitHandler();
  }, [checklistStore, submitHandler]);

  const handleGoHome = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "StaffDashboard" }],
      })
    );
  };

  return (
    <View style={styles.screen}>
      <TopNavigation title="SingHealth" alignment="center" />
      <Divider />
      <Layout style={styles.layout}>
        <View style={styles.animationContainer}>
          {submitting && <SuccessAnimation loading={submitting} />}
          {!submitting && !error && <SuccessAnimation loading={submitting} />}
          {!submitting && error && <CrossAnimation loading={submitting} />}
        </View>
        {!submitting && (
          <>
            <Text style={styles.text}>
              Audit submitted on: {new Date().toLocaleDateString()}
            </Text>
            <Button onPress={handleGoHome}>GO HOME</Button>
          </>
        )}
      </Layout>
    </View>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    height: 200,
    width: 200,
  },
  text: {
    fontWeight: "bold",
  },
});

export default AuditSubmitScreen;
