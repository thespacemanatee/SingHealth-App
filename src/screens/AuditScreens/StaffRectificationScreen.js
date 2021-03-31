import React, { useState, useEffect, useCallback } from "react";
import { View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  Input,
  Text,
  useTheme,
  Button,
  Toggle,
} from "@ui-kitten/components";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import alert from "../../components/CustomAlert";
import * as authActions from "../../store/actions/authActions";
import * as checklistActions from "../../store/actions/checklistActions";
import * as databaseActions from "../../store/actions/databaseActions";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import { SCREEN_HEIGHT } from "../../helpers/config";
import CenteredLoading from "../../components/ui/CenteredLoading";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const StaffRectificationScreen = ({ route, navigation }) => {
  const checklistStore = useSelector((state) => state.checklist);
  const { index } = route.params;
  const { checklistType } = route.params;
  const { question } = route.params;
  const { section } = route.params;
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [uploadImageArray, setUploadImageArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadDialog, setLoadDialog] = useState(false);
  const [error, setError] = useState(false);
  const [toggle, setToggle] = useState(false);

  const onToggleChange = (isChecked) => {
    if (isChecked) {
      alert("Are you sure?", "You can only do this once.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            setToggle(isChecked);
          },
        },
      ]);
    } else {
      setToggle(isChecked);
    }
  };

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleSubmitRectification = async () => {
    try {
      setLoadDialog(true);
      const temp = uploadImageArray.map((e) => e.name);
      const data = {
        [checklistType]: [
          {
            category: section,
            index,
            rectificationImages: temp,
            rectificationRemarks: value,
            requestForExt: toggle,
          },
        ],
      };

      const base64images = { images: [] };

      uploadImageArray.forEach((image) => {
        base64images.images.push({
          fileName: image.name,
          uri: image.uri,
        });
      });

      console.log(base64images);

      // let res;
      if (base64images.images.length > 0) {
        await Promise.all([
          dispatch(
            checklistActions.submitRectification(
              checklistStore.auditMetadata._id,
              data
            )
          ),
          dispatch(databaseActions.postAuditImagesWeb(base64images)),
        ]);
      } else {
        await dispatch(
          checklistActions.submitRectification(
            checklistStore.auditMetadata._id,
            data
          )
        );
      }

      // console.log("RESPONSE:", res);
    } catch (err) {
      handleErrorResponse(err);
    }
    setLoadDialog(false);
  };

  const getImages = async () => {
    if (
      checklistStore.chosen_checklist.questions[section][index]
        .rectificationImages
    ) {
      setLoading(true);
      try {
        await Promise.all(
          checklistStore.chosen_checklist.questions[section][
            index
          ].rectificationImages.map(async (fileName) => {
            if (!fileName.name) {
              const res = await dispatch(checklistActions.getImage(fileName));
              dispatch(
                checklistActions.addImage(
                  checklistType,
                  section,
                  index,
                  fileName,
                  `data:image/jpg;base64,${res.data}`,
                  true
                )
              );
            }
          })
        );
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        handleErrorResponse(err);
      }
    }
  };

  // TODO: Cleanup memory leak when user leaves screen before image is loaded
  useEffect(() => {
    console.log("USEEFFECT");
    getImages();
    if (checklistType === "covid") {
      // eslint-disable-next-line no-unused-expressions
      checklistStore.covid19.questions[section][index].requestForExt
        ? setToggle(true)
        : setToggle(false);
    } else {
      // eslint-disable-next-line no-unused-expressions
      checklistStore.chosen_checklist.questions[section][index].requestForExt
        ? setToggle(true)
        : setToggle(false);
    }
  }, []);

  useEffect(() => {
    let storeImages;
    let storeRemarks;
    if (checklistType === "covid19") {
      storeImages =
        checklistStore.covid19.questions[section][index].rectificationImages;
      storeRemarks =
        checklistStore.covid19.questions[section][index].rectificationRemarks;
    } else {
      storeImages =
        checklistStore.chosen_checklist.questions[section][index]
          .rectificationImages;
      storeRemarks =
        checklistStore.chosen_checklist.questions[section][index]
          .rectificationRemarks;
    }

    if (storeImages) {
      const images = storeImages.map((e) => e.uri);
      setImageArray(images);
      setUploadImageArray(storeImages);
    }
    if (storeRemarks) {
      setValue(storeRemarks);
    }
  }, [checklistStore, checklistType, dispatch, index, section]);

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
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

  const handleErrorResponse = (err) => {
    if (err.response) {
      const { data } = err.response;
      console.error(err.response.data);
      console.error(err.response.status);
      console.error(err.response.headers);
      if (err.response.status === 403) {
        dispatch(authActions.signOut());
      } else {
        switch (Math.floor(err.response.status / 100)) {
          case 4: {
            alert("Error", "Upload failed.");
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
      console.error(err.request);
    } else {
      console.error("Error", err.message);
    }
    console.error(err.config);
  };

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
        <Text style={styles.text}>{question}</Text>
      </View>
      <Button onPress={handleSubmitRectification}>SUBMIT RECTIFICATION</Button>
      <CenteredLoading loading={loadDialog} />
      <Layout style={styles.layout}>
        <KeyboardAwareScrollView extraHeight={200}>
          <ImageViewPager
            imageArray={imageArray}
            renderListItems={renderListItems}
          />
          <View style={styles.toggleContainer}>
            <Toggle
              style={styles.toggle}
              checked={toggle}
              onChange={onToggleChange}
              disabled
            >
              {`Tenant has ${toggle ? "" : "not"} requested for extension`}
            </Toggle>
          </View>
          <View style={styles.inputContainer}>
            <Text category="h6">Tenant&apos;s Remarks: </Text>
            <Input
              height={SCREEN_HEIGHT * 0.1}
              multiline
              textStyle={styles.input}
              placeholder="Tenant has yet to give remarks"
              value={value}
              disabled
            />
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
  text: {
    fontWeight: "bold",
  },
  toggleContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginVertical: 20,
  },
  inputContainer: {
    // marginVertical: 20,
  },
  input: {
    minHeight: 64,
  },
});
