/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import _ from "lodash";

import { store } from "../store/store";
import * as authActions from "../store/actions/authActions";
import * as checklistActions from "../store/actions/checklistActions";
import * as databaseActions from "../store/actions/databaseActions";
import alert from "../components/CustomAlert";
import { httpClient, endpoint } from "./CustomHTTPClient";

export const handleErrorResponse = (err, action) => {
  if (err.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = err.response;
    if (status === 401) {
      store.dispatch(authActions.signOut());
      store.dispatch(checklistActions.clear());
      store.dispatch(databaseActions.clear());
    } else {
      switch (Math.floor(err.response.status / 100)) {
        case 4:
          alert(
            "Error",
            data.description,
            action
              ? [
                  { text: "Cancel", style: "cancel" },
                  { text: "Confirm", onPress: action },
                ]
              : [{ text: "Okay" }]
          );
          break;

        case 5:
          alert("Server Error", "Please contact your administrator.");
          break;

        default:
          alert("Request timeout", "Check your internet connection.");
          break;
      }
    }
  } else if (err.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    alert("Request timeout", "Check your internet connection.");
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error(err);
  }
};

export const getS3Image = async (fileName) => {
  const { data } = await httpClient(`${endpoint}images/download-url`, {
    params: {
      fileName,
    },
  });
  return data.data;
};

export const uploadToS3 = async (image) => {
  const res = await httpClient(`${endpoint}/images/upload-url`);
  const s3UrlData = res.data.data;
  const fileName = s3UrlData.fields.key;
  const formData = new FormData();

  Object.keys(s3UrlData.fields).forEach((key) => {
    formData.append(key, s3UrlData.fields[key]);
  });

  let result;
  if (Platform.OS === "web") {
    const imageData = await fetch(image.uri);
    const imageBlob = await imageData.blob();
    formData.append("file", imageBlob);
    result = await axios(s3UrlData.url, {
      method: "post",
      headers: {
        "content-type": "multipart/form-data",
      },
      data: formData,
    });
  } else {
    const imageData = await fetch(image.uri);
    const imageBlob = await imageData.blob();
    formData.append("file", imageBlob);
    result = await FileSystem.uploadAsync(s3UrlData.url, image.uri, {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      mimeType: "image/png",
      parameters: s3UrlData.fields,
    });
  }
  return { result, fileName };
};

export const processAuditForms = async (checklist) => {
  const tempChecklist = _.cloneDeep(checklist);
  const chosenKeys = Object.keys(checklist.questions);
  for (const section of chosenKeys) {
    for (const question of tempChecklist.questions[section]) {
      if (question.answer !== false) {
        delete question.deadline;
      }
      const images = question.image;
      if (images) {
        if (images.length === 0) {
          delete question.images;
        } else {
          await Promise.all(
            images.map(() => {
              return httpClient(`${endpoint}/images/upload-url`);
            })
          );

          const res = await Promise.all(
            images.map((e) => {
              return uploadToS3(e);
            })
          );

          const chosenChecklistImages = [];
          res.forEach((e) => {
            chosenChecklistImages.push(e.fileName);
          });

          tempChecklist.questions[section][question.index - 1].image =
            chosenChecklistImages;
        }
      }
    }
  }
  return tempChecklist;
};

export const saveDestination = async (id, imageData) => {
  const fileName = `${`${id}${Math.round(Date.now() * Math.random())}`}.jpg`;
  let destination;
  if (Platform.OS === "web") {
    destination = imageData.uri;
  } else {
    destination = FileSystem.cacheDirectory + fileName.replace(/\s+/g, "");
    await FileSystem.copyAsync({
      from: imageData.uri,
      to: destination,
    });
  }
  return { fileName, destination };
};

export const processRectifications = async (images) => {
  await Promise.all(
    images.map(() => {
      return httpClient(`${endpoint}/images/upload-url`);
    })
  );
  const res = await Promise.all(
    images.map((e) => {
      return uploadToS3(e);
    })
  );

  return res;
};
