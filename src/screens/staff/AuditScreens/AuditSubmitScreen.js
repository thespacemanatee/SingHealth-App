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
  TopNavigationAction,
  Icon,
} from "@ui-kitten/components";
import _ from "lodash";
import moment from "moment";

import { StackActions } from "@react-navigation/routers";
import SuccessAnimation from "../../../components/ui/SuccessAnimation";
import CrossAnimation from "../../../components/ui/CrossAnimation";
import * as databaseActions from "../../../store/actions/databaseActions";
import * as authActions from "../../../store/actions/authActions";
import alert from "../../../components/CustomAlert";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const submitHandler = useCallback(async () => {
    setError(false);
    setSubmitting(true);
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
        setSubmitting(false);
      } catch (err) {
        setError(true);
        handleErrorResponse(err, handleGoBack);
        setSubmitting(false);
      }
    },
    [dispatch, handleGoBack]
  );

  useEffect(() => {
    submitHandler();
  }, [checklistStore, submitHandler]);

  const handleGoHome = () => {
    navigation.dispatch(StackActions.popToTop());
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleRetry = () => {
    submitHandler();
  };

  const renderBackAction = () => {
    return error ? (
      <TopNavigationAction icon={BackIcon} onPress={handleGoBack} />
    ) : null;
  };

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="SingHealth"
        alignment="center"
        accessoryLeft={renderBackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <View style={styles.animationContainer}>
          {submitting && <SuccessAnimation loading />}
          {!submitting && error && <CrossAnimation loading={false} />}
          {!submitting && !error && <SuccessAnimation loading={false} />}
        </View>
        <View style={styles.layoutContent} />
        {!submitting && (
          <View style={styles.bottomContainer}>
            {error ? (
              <Button style={styles.button} onPress={handleRetry}>
                RETRY
              </Button>
            ) : null}
            <Button style={styles.button} onPress={handleGoHome}>
              GO HOME
            </Button>

            <Text style={styles.text}>
              Audit submitted on:{" "}
              {moment(new Date())
                .toLocaleString()
                .split(" ")
                .slice(0, 5)
                .join(" ")}
            </Text>
          </View>
        )}
      </Layout>
    </View>
  );
};

const handleErrorResponse = (err, handleGoBack) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data } = err.response;
    console.error(err.response.data);
    console.error(err.response.status);
    console.error(err.response.headers);
    if (err.response.status === 403) {
      authActions.signOut();
    } else {
      switch (Math.floor(err.response.status / 100)) {
        case 4: {
          alert(
            "Error",
            `${data.description} in question ${data.index + 1}, under the ${
              data.category
            } section.`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Go back",
                onPress: handleGoBack,
              },
            ]
          );
          break;
        }
        case 5: {
          alert("Server Error", "Please contact your administrator.");
          break;
        }
        default: {
          alert("Request timeout", "Check your internet connection.");
          break;
        }
      }
    }
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

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  layout: {
    flex: 1,
    alignItems: "center",
  },
  layoutContent: {
    flex: 1,
  },
  animationContainer: {
    height: 200,
    width: 200,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
  bottomContainer: {
    marginVertical: 10,
  },
  button: {
    marginBottom: 10,
  },
});

export default AuditSubmitScreen;
