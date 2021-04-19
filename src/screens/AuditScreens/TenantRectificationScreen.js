import React, { useState, useEffect, useCallback } from "react";
import { View, Platform, useWindowDimensions } from "react-native";
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
  Toggle,
} from "@ui-kitten/components";
import axios from "axios";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import useMountedState from "react-use/lib/useMountedState";

import alert from "../../components/CustomAlert";
import * as checklistActions from "../../store/actions/checklistActions";
import * as databaseActions from "../../store/actions/databaseActions";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";
import CustomText from "../../components/ui/CustomText";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const CameraIcon = (props) => <Icon {...props} name="camera-outline" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

const TenantRectificationScreen = ({ route, navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const checklistStore = useSelector((state) => state.checklist);
  const [value, setValue] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [uploadImageArray, setUploadImageArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadDialog, setLoadDialog] = useState(false);
  const [error, setError] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [disableToggle, setDisableToggle] = useState(false);
  const [rectified, setRectified] = useState(false);

  const { index, checklistType, question, section } = route.params;

  const isMounted = useMountedState();

  const windowDimensions = useWindowDimensions();
  const { height } = windowDimensions;

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleExtendDeadline = async (isChecked) => {
    setToggle(true);
    setDisableToggle(true);
    const data = {
      [checklistType]: [
        {
          category: section,
          index,
          requestForExt: isChecked,
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
    }
  };

  const onToggleChange = (isChecked) => {
    if (isChecked) {
      alert("Are you sure?", "You can only do this once.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => handleExtendDeadline(isChecked),
        },
      ]);
    } else {
      setToggle(isChecked);
    }
  };

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

      // let res;
      if (base64images.images.length > 0) {
        await dispatch(databaseActions.postAuditImagesWeb(base64images));
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
      } else {
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
      }

      Toast.show({
        text1: "Success",
        text2: "Your rectification has been submitted.",
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

  const changeTextHandler = (val) => {
    setValue(val);
  };

  const onBlurHandler = () => {
    dispatch(
      checklistActions.addRemarks(checklistType, section, index, value, true)
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
          setError(err);
          handleErrorResponse(err);
        } finally {
          setLoading(false);
        }
      }
    };

    getImages();

    // eslint-disable-next-line no-unused-expressions
    checklistStore[type].questions[section][index].requestForExt
      ? (setToggle(true), setDisableToggle(true))
      : (setToggle(false), setDisableToggle(false));

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
    const storeRectified =
      checklistStore[type].questions[section][index].rectified;

    if (storeImages) {
      const images = storeImages.map((e) => e.uri);
      if (isMounted()) {
        setImageArray(images);
        setUploadImageArray(storeImages);
      }
    }
    if (storeRemarks) {
      if (isMounted()) {
        setValue(storeRemarks);
      }
    }
    if (storeRectified) {
      if (isMounted()) {
        setRectified(storeRectified);
      }
    }
  }, [checklistStore, checklistType, dispatch, index, isMounted, section]);

  const onSave = async (imageData) => {
    if (imageArray.length > 2) {
      alert("Upload Failed", "Max upload count is 3.", [{ text: "OK" }]);
    } else {
      const fileName = `${`${checklistStore.chosen_tenant.tenantID}${Math.round(
        Date.now() * Math.random()
      )}`}.jpg`;

      let destination;
      if (Platform.OS === "web") {
        destination = imageData.uri;
      } else {
        destination = `data:image/jpg;base64,${imageData.base64}`;
      }

      const tempImageArray = [...imageArray];
      const tempUploadImageArray = [...uploadImageArray];
      tempImageArray.push(destination);
      tempUploadImageArray.push({ uri: destination, name: fileName });
      setImageArray(tempImageArray);
      setUploadImageArray(tempUploadImageArray);
      dispatch(
        checklistActions.addImage(
          checklistType,
          section,
          index,
          fileName,
          destination,
          true
        )
      );
    }
  };

  const startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      navigation.navigate("CameraModal", { onSave });
    } else {
      alert("Access denied");
    }
  };

  const imagePickerHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      onSave(result);
    }
  };

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

  const CameraAction = () => (
    <TopNavigationAction
      icon={CameraIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          navigation.navigate("CameraModal", { onSave });
        } else {
          startCamera();
        }
      }}
    />
  );

  const ImageAction = () => (
    <TopNavigationAction
      icon={ImageIcon}
      onPress={() => {
        // if (Platform.OS === "web") {
        //   navigation.navigate("CameraModal", { onSave: onSave });
        // } else {
        imagePickerHandler();
        // }
      }}
    />
  );

  const renderRightActions = () => {
    return (
      <>
        <CameraAction />
        <ImageAction />
      </>
    );
  };

  const handleExpandImage = useCallback(
    (selectedIndex) => {
      navigation.navigate("ExpandImages", {
        imageArray,
        selectedIndex,
      });
    },
    [imageArray, navigation]
  );

  const handleDeleteImage = useCallback(
    (selectedIndex) => {
      alert("Delete Image", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const tempImageArray = [...imageArray];
            const tempUploadImageArray = [...uploadImageArray];
            tempImageArray.splice(selectedIndex, 1);
            tempUploadImageArray.splice(selectedIndex, 1);
            dispatch(
              checklistActions.deleteImage(
                checklistType,
                section,
                index,
                selectedIndex,
                true
              )
            );
            setImageArray(tempImageArray);
            setUploadImageArray(tempUploadImageArray);
          },
        },
      ]);
    },
    [checklistType, dispatch, imageArray, index, section, uploadImageArray]
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
          onDelete={handleDeleteImage}
          loading={loading}
        />
      );
    },
    [handleDeleteImage, handleExpandImage, index, loading, section]
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Details"
        alignment="center"
        accessoryLeft={BackAction}
        accessoryRight={renderRightActions}
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
      <Button
        style={styles.button}
        onPress={handleSubmitRectification}
        disabled={rectified}
      >
        {rectified ? "SUBMISSION APPROVED" : "SUBMIT FOR APPROVAL"}
      </Button>
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
              disabled={disableToggle}
            >
              {toggle
                ? "You have requested for an extension"
                : "Request for extension"}
            </Toggle>
          </View>
          <View style={styles.inputContainer}>
            <CustomText bold>Remarks: </CustomText>
            <Input
              height={height * 0.1}
              multiline
              textStyle={styles.input}
              placeholder="Enter your remarks here"
              value={value}
              onChangeText={changeTextHandler}
              onBlur={onBlurHandler}
            />
          </View>
        </KeyboardAwareScrollView>
      </Layout>
    </View>
  );
};

export default TenantRectificationScreen;

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
  inputContainer: {
    // marginVertical: 20,
  },
  button: {
    borderRadius: 0,
  },
  input: {
    minHeight: 64,
  },
});
