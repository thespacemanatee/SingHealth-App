import React, { useState, useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
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

import SuccessAnimation from "../../components/ui/SuccessAnimation";
import CrossAnimation from "../../components/ui/CrossAnimation";
import * as databaseActions from "../../store/actions/databaseActions";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";

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
          element.image.forEach((image) => {
            if (Platform.OS === "web") {
              base64images.images.push({
                fileName: image.name,
                uri: image.uri,
              });
            } else {
              formData.append("images", {
                ...image,
                type: "image/jpg",
              });
            }
            chosenChecklistImages.push(image.name);
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
        if (element.answer !== false) {
          // eslint-disable-next-line no-param-reassign
          delete element.deadline;
        }
        if (element.image) {
          imageAdded = true;
          element.image.forEach((image) => {
            if (Platform.OS === "web") {
              base64images.images.push({
                fileName: image.name,
                uri: image.uri,
              });
            } else {
              formData.append("images", {
                ...image,
                type: "image/jpeg",
              });
            }
            covid19ChecklistImages.push(image.name);
          });
          tempCovid19Checklist.questions[section][
            index
          ].image = covid19ChecklistImages;
          covid19ChecklistImages = [];
        }
      });
    });

    const auditData = {
      auditMetadata: checklistStore.auditMetadata,
      auditForms: {
        [chosenChecklistType]: tempChosenChecklist,
        covid19: tempCovid19Checklist,
      },
    };

    uploadAuditData(imageAdded, auditData, base64images, formData);
  }, [
    checklistStore.auditMetadata,
    checklistStore.chosen_checklist,
    checklistStore.chosen_checklist_type,
    checklistStore.covid19,
    uploadAuditData,
  ]);

  const uploadAuditData = useCallback(
    async (imageAdded, auditData, base64images, formData) => {
      try {
        let imageRes;
        if (imageAdded) {
          if (Platform.OS === "web") {
            imageRes = dispatch(
              databaseActions.postAuditImagesWeb(base64images)
            );
          } else {
            imageRes = await dispatch(
              databaseActions.postAuditImages(formData)
            );
          }
        }

        console.log(imageRes);

        const formRes = await dispatch(
          databaseActions.postAuditForm(auditData)
        );

        console.log(formRes);
      } catch (err) {
        setError(true);
        handleErrorResponse(err, handleGoBack);
      } finally {
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

            {!error ? (
              <CustomText style={styles.text}>
                Audit submitted on:{" "}
                {moment(new Date())
                  .toLocaleString()
                  .split(" ")
                  .slice(0, 5)
                  .join(" ")}
              </CustomText>
            ) : null}
          </View>
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
