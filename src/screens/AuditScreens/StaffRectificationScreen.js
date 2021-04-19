import React, { useState, useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  useTheme,
  Button,
  Toggle,
  Card,
} from "@ui-kitten/components";
import Toast from "react-native-toast-message";
import axios from "axios";
import { StackActions } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import useMountedState from "react-use/lib/useMountedState";

import alert from "../../components/CustomAlert";
import * as checklistActions from "../../store/actions/checklistActions";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import CustomDatepicker from "../../components/CustomDatePicker";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const StaffRectificationScreen = ({ route, navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const checklistStore = useSelector((state) => state.checklist);
  const [value, setValue] = useState();
  const [imageArray, setImageArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadDialog, setLoadDialog] = useState(false);
  const [error, setError] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [isRectified, setIsRectified] = useState(false);
  const [deadline, setDeadline] = useState();

  const { index, checklistType, question, section } = route.params;

  const isMounted = useMountedState();

  const theme = useTheme();

  const dispatch = useDispatch();

  const submitApproval = async () => {
    try {
      setLoadDialog(true);
      const data = {
        [checklistType]: [
          {
            category: section,
            index,
            rectified: !isRectified,
          },
        ],
      };

      await dispatch(
        checklistActions.submitRectification(
          checklistStore.auditMetadata._id,
          data,
          authStore.userType,
          checklistType,
          section,
          index,
          !isRectified
        )
      );

      Toast.show({
        text1: "Success",
        text2: `Your ${
          isRectified ? "revocation" : "approval"
        } has been recorded.`,
      });
      navigation.dispatch(StackActions.pop(2));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setLoadDialog(false);
      }
    }
  };

  const handleDateChange = async (date) => {
    setLoadDialog(true);
    setDeadline(date);
    const data = {
      [checklistType]: [
        {
          category: section,
          index,
          deadline: date,
        },
      ],
    };

    try {
      await dispatch(
        checklistActions.submitRectification(
          checklistStore.auditMetadata._id,
          data,
          authStore.userType,
          checklistType,
          section,
          index
        )
      );
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setLoadDialog(false);
      }
    }

    dispatch(
      checklistActions.changeDeadline(checklistType, section, index, {
        $date: date,
      })
    );
  };

  const handleSubmitApproval = () => {
    alert(
      "Are you sure?",
      isRectified
        ? "Mark rectification as incomplete."
        : "Mark rectification as complete.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: submitApproval,
        },
      ]
    );
  };

  // TODO: Cleanup memory leak when user leaves screen before image is loaded
  useEffect(() => {
    let type;
    if (checklistType === "covid19") {
      type = "covid19";
    } else {
      type = "chosen_checklist";
    }
    const source = axios.CancelToken.source();
    const getImages = async () => {
      if (checklistStore[type].questions[section][index].rectificationImages) {
        setLoading(true);
        try {
          await Promise.all(
            checklistStore[type].questions[section][
              index
            ].rectificationImages.map(async (fileName) => {
              if (!fileName.name) {
                const res = await dispatch(
                  checklistActions.getImage(fileName, source)
                );
                dispatch(
                  checklistActions.addImage(
                    checklistType,
                    section,
                    index,
                    fileName,
                    `data:image/jpg;base64,${res.data.data}`,
                    true
                  )
                );
              }
            })
          );
        } catch (err) {
          if (isMounted()) {
            setError(err);
          }
          handleErrorResponse(err);
        } finally {
          if (isMounted()) {
            setLoading(false);
          }
        }
      }
    };
    getImages();

    // eslint-disable-next-line no-unused-expressions
    checklistStore[type].questions[section][index].requestForExt
      ? setToggle(true)
      : setToggle(false);

    return () => {
      source.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let type;
    if (checklistType === "covid19") {
      type = "covid19";
    } else {
      type = "chosen_checklist";
    }

    const storeImages =
      checklistStore[type].questions[section][index].rectificationImages;
    const storeRemarks =
      checklistStore[type].questions[section][index].rectificationRemarks;
    const storeDeadline =
      checklistStore[type].questions[section][index].deadline;
    const storeRectified =
      checklistStore[type].questions[section][index].rectified;

    if (storeImages) {
      const images = storeImages.map((e) => e.uri);
      if (isMounted()) {
        setImageArray(images);
      }
    }
    if (storeRemarks) {
      if (isMounted()) {
        setValue(storeRemarks);
      }
    }
    if (storeDeadline) {
      if (isMounted()) {
        setDeadline(moment(storeDeadline.$date || storeDeadline));
      }
    }
    if (storeRectified) {
      if (isMounted()) {
        setIsRectified(storeRectified);
      }
    }
  }, [checklistStore, checklistType, dispatch, index, isMounted, section]);

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          window.history.back();
        } else {
          navigation.goBack();
        }
      }}
    />
  );

  const handleExpandImage = useCallback(
    (selectedIndex) => {
      navigation.navigate("ExpandImages", {
        imageArray,
        selectedIndex,
      });
    },
    [imageArray, navigation]
  );

  const renderListItems = useCallback(
    (itemData) => {
      return (
        <ImagePage
          imageUri={itemData.item}
          index={index}
          section={section}
          selectedIndex={itemData.index}
          onPress={() => handleExpandImage(itemData.index)}
          loading={loading}
        />
      );
    },
    [handleExpandImage, index, loading, section]
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Details"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <View
        style={[
          styles.titleContainer,
          { backgroundColor: theme["color-primary-400"] },
        ]}
      >
        <CustomText bold>{question}</CustomText>
      </View>
      <Button style={styles.button} onPress={handleSubmitApproval}>
        {isRectified ? "REVOKE APPROVAL" : "APPROVE"}
      </Button>
      <CenteredLoading loading={loadDialog} />
      <Layout style={styles.layout}>
        <KeyboardAwareScrollView extraHeight={200}>
          <ImageViewPager
            imageArray={imageArray}
            renderListItems={renderListItems}
          />
          <View style={styles.toggleContainer}>
            <Toggle style={styles.toggle} checked={toggle} disabled>
              {`Tenant has ${toggle ? "" : "not"} requested for extension`}
            </Toggle>
          </View>
          <View style={styles.bottomContainer}>
            {toggle && (
              <>
                <CustomText bold category="h6">
                  Extend Deadline:
                </CustomText>
                <CustomDatepicker
                  deadline={deadline}
                  onSelect={handleDateChange}
                />
              </>
            )}
            <CustomText bold category="h6">
              Tenant&apos;s Remarks:{" "}
            </CustomText>
            <Card style={styles.card}>
              <CustomText>
                {value || "Tenant has yet to give remarks"}
              </CustomText>
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    </View>
  );
};

export default StaffRectificationScreen;

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 25,
  },
  toggleContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginVertical: 20,
  },
  bottomContainer: {
    paddingVertical: 10,
  },
  button: {
    borderRadius: 0,
  },
  card: {
    marginVertical: 10,
  },
});
