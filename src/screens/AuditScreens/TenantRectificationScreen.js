import React, { useState, useEffect, useCallback } from "react";
import { View, Platform } from "react-native";
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
import axios from "axios";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackActions } from "@react-navigation/native";

import alert from "../../components/CustomAlert";
import * as checklistActions from "../../store/actions/checklistActions";
import * as databaseActions from "../../store/actions/databaseActions";
import ImagePage from "../../components/ui/ImagePage";
import ImageViewPager from "../../components/ImageViewPager";
import { SCREEN_HEIGHT } from "../../helpers/config";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";

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

  const { index, checklistType, question, section, rectified } = route.params;

  console.log("RECTIFIED:", rectified);

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
            data,
            authStore.userType
          )
        );
      }

      // console.log("RESPONSE:", res);
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setLoadDialog(false);
      navigation.dispatch(StackActions.pop(2));
    }
  };

  const changeTextHandler = (val) => {
    setValue(val);
    // console.log(val);
    dispatch(
      checklistActions.addRemarks(checklistType, section, index, val, true)
    );
  };

  // TODO: Cleanup memory leak when user leaves screen before image is loaded
  useEffect(() => {
    const source = axios.CancelToken.source();
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
    console.log("USEEFFECT");
    if (checklistType === "covid") {
      // eslint-disable-next-line no-unused-expressions
      checklistStore.covid19.questions[section][index].requestForExt
        ? (setToggle(true), setDisableToggle(true))
        : (setToggle(false), setDisableToggle(false));
    } else {
      // eslint-disable-next-line no-unused-expressions
      checklistStore.chosen_checklist.questions[section][index].requestForExt
        ? (setToggle(true), setDisableToggle(true))
        : (setToggle(false), setDisableToggle(false));
    }

    return () => {
      source.cancel();
    };
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

    console.log(result);

    if (!result.cancelled) {
      onSave(result);
    }
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
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
        <Text style={styles.text}>{question}</Text>
      </View>
      <Button onPress={handleSubmitRectification} disabled={rectified}>
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
            <Text category="h6">Remarks: </Text>
            <Input
              height={SCREEN_HEIGHT * 0.1}
              multiline
              textStyle={styles.input}
              placeholder="Enter your remarks here"
              value={value}
              onChangeText={changeTextHandler}
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
