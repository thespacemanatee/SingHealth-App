/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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

import SuccessAnimation from "../../components/ui/SuccessAnimation";
import CrossAnimation from "../../components/ui/CrossAnimation";
import * as databaseActions from "../../store/actions/databaseActions";
import { handleErrorResponse, processAuditForms } from "../../helpers/utils";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const AuditSubmitScreen = ({ navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const [submitting, setSubmitting] = useState(true);
  const [error, setError] = useState(false);

  const dispatch = useDispatch();

  const submitHandler = useCallback(async () => {
    setError(false);
    setSubmitting(true);
    const chosenChecklistType = checklistStore.chosen_checklist_type;
    const tempChosenChecklist = await processAuditForms(
      checklistStore.chosen_checklist
    );
    const tempCovidChecklist = await processAuditForms(checklistStore.covid19);

    const auditData = {
      auditMetadata: checklistStore.auditMetadata,
      auditForms: {
        [chosenChecklistType]: tempChosenChecklist,
        covid19: tempCovidChecklist,
      },
    };

    console.log(auditData);

    uploadAuditData(auditData);
  }, [
    checklistStore.auditMetadata,
    checklistStore.chosen_checklist,
    checklistStore.chosen_checklist_type,
    checklistStore.covid19,
    uploadAuditData,
  ]);

  const uploadAuditData = useCallback(
    async (auditData) => {
      try {
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
