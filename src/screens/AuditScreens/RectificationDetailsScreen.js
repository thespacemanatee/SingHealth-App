import React, { useState, useEffect, useCallback } from "react";
import { Platform, View } from "react-native";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  useTheme,
  Button,
  Card,
} from "@ui-kitten/components";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import moment from "moment";
import useMountedState from "react-use/lib/useMountedState";

import * as checklistActions from "../../store/actions/checklistActions";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const RectificationDetailsScreen = ({ route, navigation }) => {
  const authStore = useAppSelector((state) => state.auth);
  const checklistStore = useAppSelector((state) => state.checklist);
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [deadline, setDeadline] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [question, setQuestion] = useState();

  const { index, checklistType, section } = route.params;

  const isMounted = useMountedState();

  const theme = useTheme();

  const dispatch = useAppDispatch();

  const handleGoToTenantRectifications = () => {
    const payload = {
      index,
      checklistType,
      question,
      section,
    };

    if (authStore.userType === "staff") {
      navigation.navigate("StaffRectification", payload);
    } else {
      navigation.navigate("TenantRectification", payload);
    }
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
      if (checklistStore[type].questions[section][index].image) {
        setLoading(true);
        try {
          await Promise.all(
            checklistStore[type].questions[section][index].image.map(
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
          if (isMounted()) {
            setLoading(false);
          }
        }
      }
    };

    getImages();

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

    const storeImages = checklistStore[type].questions[section][index].image;
    const storeRemarks = checklistStore[type].questions[section][index].remarks;
    const storeDeadline =
      checklistStore[type].questions[section][index].deadline;
    const storeQuestion =
      checklistStore[type].questions[section][index].question;

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
    if (storeQuestion) {
      if (isMounted()) {
        setQuestion(storeQuestion);
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
