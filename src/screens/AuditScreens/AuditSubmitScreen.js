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
import Toast from "react-native-toast-message";
import axios from "axios";
import * as FileSystem from "expo-file-system";

import SuccessAnimation from "../../components/ui/SuccessAnimation";
import CrossAnimation from "../../components/ui/CrossAnimation";
import * as databaseActions from "../../store/actions/databaseActions";
import { handleErrorResponse } from "../../helpers/utils";
import { endpoint, httpClient } from "../../helpers/CustomHTTPClient";

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

    // const formData = new FormData();
    // const base64images = { images: [] };
    // TODO: convert to for ... of loop
    const chosenKeys = Object.keys(checklistStore.chosen_checklist.questions);
    chosenKeys.forEach((section) => {
      tempChosenChecklist.questions[section].forEach((element, index) => {
        if (element.answer !== false) {
          // eslint-disable-next-line no-param-reassign
          delete element.deadline;
        }
        if (element.image) {
          imageAdded = true;
          element.image.forEach(async (image) => {
            try {
              const res = await httpClient(`${endpoint}/images/upload-url`);
              const s3UrlData = res.data.data;
              const formData = new FormData();
              const imageData = await fetch(image.uri);
              const imageBlob = await imageData.blob();
              Object.keys(s3UrlData.fields).forEach((key) => {
                console.log(key, s3UrlData.fields[key]);
                formData.append(key, s3UrlData.fields[key]);
              });
              formData.append("file", imageBlob);
              // const upload = await FileSystem.uploadAsync(
              //   s3UrlData.url,
              //   image.uri,
              //   {
              //     uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              //     fieldName: "file",
              //     mimeType: "image/jpg",
              //     parameters: s3UrlData.fields,
              //   }
              // );
              // console.log(JSON.stringify(upload));
              chosenChecklistImages.push(s3UrlData.fields.key);
              console.log(s3UrlData.fields);
            } catch (err) {
              handleErrorResponse(err);
            }
          });
          tempChosenChecklist.questions[section][index].image =
            chosenChecklistImages;
          chosenChecklistImages = [];
        }
      });
    });

    // TODO: convert to for ... of loop
    const covid19Keys = Object.keys(checklistStore.covid19.questions);
    covid19Keys.forEach((section) => {
      tempCovid19Checklist.questions[section].forEach((element, index) => {
        if (element.answer !== false) {
          // eslint-disable-next-line no-param-reassign
          delete element.deadline;
        }
        if (element.image) {
          imageAdded = true;
          element.image.forEach(async (image) => {
            try {
              const res = await httpClient(`${endpoint}/images/upload-url`);
              const s3UrlData = res.data.data;
              const formData = new FormData();
              const imageData = await fetch(image.uri);
              const imageBlob = await imageData.blob();
              Object.keys(s3UrlData.fields).forEach((key) => {
                formData.append(key, s3UrlData.fields[key]);
              });
              formData.append("file", imageBlob);
              const upload = await FileSystem.uploadAsync(
                s3UrlData.url,
                image.uri,
                {
                  uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                  fieldName: "file",
                  mimeType: "image/jpg",
                  parameters: s3UrlData.fields,
                }
              );
              console.log(JSON.stringify(upload));
              covid19ChecklistImages.push(s3UrlData.fields.fileName);
            } catch (err) {
              handleErrorResponse(err);
            }
          });
          tempCovid19Checklist.questions[section][index].image =
            covid19ChecklistImages;
          covid19ChecklistImages = [];
        }
      });
    });

    setSubmitting(false);
    setError(true);

    const auditData = {
      auditMetadata: checklistStore.auditMetadata,
      auditForms: {
        [chosenChecklistType]: tempChosenChecklist,
        covid19: tempCovid19Checklist,
      },
    };

    console.log(auditData);

    // uploadAuditData(imageAdded, auditData);
  }, [
    checklistStore.auditMetadata,
    checklistStore.chosen_checklist,
    checklistStore.chosen_checklist_type,
    checklistStore.covid19,
    // uploadAuditData,
  ]);

  const uploadAuditData = useCallback(
    async (imageAdded, auditData) => {
      try {
        // if (imageAdded) {
        //   if (Platform.OS === "web") {
        //     await dispatch(databaseActions.postAuditImagesWeb(base64images));
        //   } else {
        //     await dispatch(databaseActions.postAuditImages(formData));
        //   }
        // }

        await dispatch(databaseActions.postAuditForm(auditData));

        Toast.show({
          text1: "Success",
          text2: `Audit submitted on: ${moment(new Date())
            .toLocaleString()
            .split(" ")
            .slice(0, 5)
            .join(" ")}`,
        });
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
    if (Platform.OS === "web") {
      window.history.back();
    } else {
      navigation.goBack();
    }
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
            {error && (
              <Button style={styles.button} onPress={handleRetry}>
                RETRY
              </Button>
            )}
            <Button style={styles.button} onPress={handleGoHome}>
              GO HOME
            </Button>
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
    width: "100%",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    marginBottom: 10,
  },
});

export default AuditSubmitScreen;
