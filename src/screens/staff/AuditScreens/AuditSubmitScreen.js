import React, { useState, useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Text,
  Button,
  Divider,
  Layout,
  StyleService,
  TopNavigation,
} from "@ui-kitten/components";
import _ from "lodash";

import { CommonActions } from "@react-navigation/routers";
import SuccessAnimation from "../../../components/ui/SuccessAnimation";
import CrossAnimation from "../../../components/ui/CrossAnimation";
import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse } from "../../../store/actions/authActions";

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

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
    // console.log(tempChosenChecklist);

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

    // console.log(formData);

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

    uploadAuditData(imageAdded, auditData, base64images, formData);

    // if (imageAdded) {
    //   Promise.all([
    //     axios(postAudit),
    //     axios(Platform.OS === "web" ? postImagesWeb : postImages),
    //   ])
    //     .then(
    //       axios.spread((req1, req2) => {
    //         console.log(req1.data, "req1");
    //         console.log(req2.data, "req2");
    //       })
    //     )
    //     .catch((err) => {
    //       handleErrorResponse(err);
    //     });
    // } else {
    //   axios(postAudit)
    //     .then((req) => {
    //       console.log(req.data, "req");
    //     })
    //     .catch((err) => {
    //       handleErrorResponse(err);
    //     });
    // }

    setSubmitting(false);
  }, [
    checklistStore.chosen_checklist,
    checklistStore.chosen_checklist_type,
    checklistStore.chosen_tenant.tenantID,
    checklistStore.covid19,
    uploadAuditData,
  ]);

  const uploadAuditData = useCallback(
    async (imageAdded, auditData, base64images, formData) => {
      try {
        let res;
        if (imageAdded) {
          // await dispatch(databaseActions.postAuditForm(auditData));
          if (Platform.OS === "web") {
            res = await Promise.all([
              dispatch(databaseActions.postAuditForm(auditData)),
              dispatch(databaseActions.postAuditImagesWeb(base64images)),
            ]);
          } else {
            res = await Promise.all([
              dispatch(databaseActions.postAuditForm(auditData)),
              dispatch(databaseActions.postAuditImages(formData)),
            ]);
          }
        } else {
          res = await dispatch(databaseActions.postAuditForm(auditData));
        }

        console.log(res);
      } catch (err) {
        handleErrorResponse(err);
      }
    },
    [dispatch]
  );

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
