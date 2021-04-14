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
  Input,
  useTheme,
  Button,
  Card,
} from "@ui-kitten/components";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";

import * as checklistActions from "../../store/actions/checklistActions";
import CustomDatepicker from "../../components/CustomDatePicker";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import { SCREEN_HEIGHT } from "../../helpers/config";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const RectificationDetailsScreen = ({ route, navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const checklistStore = useSelector((state) => state.checklist);
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [deadline, setDeadline] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { index, checklistType, question, section, rectified } = route.params;

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleGoToTenantRectifications = () => {
    if (authStore.userType === "staff") {
      navigation.navigate("StaffRectification", {
        index,
        checklistType,
        question,
        section,
        rectified,
      });
    } else {
      navigation.navigate("TenantRectification", {
        index,
        checklistType,
        question,
        section,
        rectified,
      });
    }
  };

  // TODO: Cleanup memory leak when user leaves screen before image is loaded
  useEffect(() => {
    console.log("USEEFFECT");
    const source = axios.CancelToken.source();
    const getImages = async () => {
      if (checklistStore.chosen_checklist.questions[section][index].image) {
        setLoading(true);
        try {
          await Promise.all(
            checklistStore.chosen_checklist.questions[section][index].image.map(
              async (fileName) => {
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
                      `data:image/jpg;base64,${res.data.data}`
                    )
                  );
                }
              }
            )
          );
          setLoading(false);
        } catch (err) {
          if (axios.isCancel(err)) {
            // do nothing
          } else {
            setError(err);
            handleErrorResponse(err);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    getImages();

    return () => {
      source.cancel();
    };
  }, []);

  useEffect(() => {
    let storeImages;
    let storeRemarks;
    let storeDeadline;
    if (
      Object.prototype.hasOwnProperty.call(
        checklistStore.covid19.questions,
        section
      )
    ) {
      storeImages = checklistStore.covid19.questions[section][index].image;
      storeRemarks = checklistStore.covid19.questions[section][index].remarks;
      storeDeadline = checklistStore.covid19.questions[section][index].deadline;
    } else {
      storeImages =
        checklistStore.chosen_checklist.questions[section][index].image;
      storeRemarks =
        checklistStore.chosen_checklist.questions[section][index].remarks;
      storeDeadline =
        checklistStore.chosen_checklist.questions[section][index].deadline;
    }

    if (storeImages) {
      const images = storeImages.map((e) => e.uri);
      setImageArray(images);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
    if (storeDeadline) {
      setDeadline(
        moment(storeDeadline.$date || storeDeadline)
          .toLocaleString()
          .split(" ")
          .slice(0, 4)
          .join(" ")
      );
    }
  }, [checklistStore, dispatch, index, section]);

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
          rectify
          loading={loading}
        />
      );
    },
    [handleExpandImage, index, loading, section]
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Rectify"
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
      <Button style={styles.button} onPress={handleGoToTenantRectifications}>
        {authStore.userType === "staff" ? "CHECK STATUS" : "RECTIFY NOW"}
      </Button>
      <Layout style={styles.layout}>
        <KeyboardAwareScrollView extraHeight={200}>
          <ImageViewPager
            imageArray={imageArray}
            renderListItems={renderListItems}
          />
          <View style={styles.bottomContainer}>
            <CustomText bold category="h6">
              Deadline:{" "}
            </CustomText>
            <Card style={styles.card}>
              <CustomText>{deadline}</CustomText>
            </Card>
            <CustomText bold category="h6">
              Remarks:{" "}
            </CustomText>
            <Card style={styles.card}>
              <CustomText>{value}</CustomText>
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    </View>
  );
};

export default RectificationDetailsScreen;

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
