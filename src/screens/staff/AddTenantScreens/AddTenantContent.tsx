import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  Button,
  Icon,
  StyleService,
  useTheme,
  Toggle,
} from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import Toast from "react-native-toast-message";
import { StackActions } from "@react-navigation/routers";
import useMountedState from "react-use/lib/useMountedState";
import * as ImagePicker from "expo-image-picker";

import CustomTextInput from "../../../components/CustomTextInput";
import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse, uploadToS3 } from "../../../helpers/utils";
import CenteredLoading from "../../../components/ui/CenteredLoading";
import {
  MIN_HEADER_HEIGHT,
  WEB_PADDINGTOP,
} from "../../../components/createTenant/Model";

interface AddTenantContentProps {
  navigation: any;
  imageAdded: ImagePicker.ImagePickerResult;
}

const AddTenantContent = ({
  navigation,
  imageAdded,
}: AddTenantContentProps) => {
  const authStore = useSelector((state) => state.auth);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const { height } = useWindowDimensions();

  const isMounted = useMountedState();

  const theme = useTheme();

  const dispatch = useDispatch();

  const onCheckedChange = (isChecked: boolean) => {
    setChecked(isChecked);
  };

  const handleSubmitForm = async (values) => {
    try {
      setLoading(true);
      let image: any;
      if (imageAdded) {
        const { fileName } = await uploadToS3(imageAdded);
        image = fileName;
      }
      const data = {
        ...values,
        institutionID: authStore.institutionID,
        staffID: authStore._id,
        image,
      };

      await dispatch(databaseActions.createNewTenant(data));

      Toast.show({
        type: "success",
        text1: "Success",
        text2: `You have successfully added ${values.stallName} to the database!`,
      });

      navigation.dispatch(StackActions.popToTop());
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Please enter tenant name!"),
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter tenant's email!"),
    pswd: Yup.string()
      .required("Please enter your password!")
      .min(8, "Password is too short - should be 8 chars minimum."),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("pswd"), null],
      "Passwords must match"
    ),
    stallName: Yup.string().required("Please enter tenant's stall name!"),
    fnb: Yup.boolean().required(
      "Please indicate if the stall is FNB or non-FNB!"
    ),
  });

  const renderSecureIcon = (props: any) => (
    <TouchableOpacity
      onPress={() => {
        setSecureTextEntry(!secureTextEntry);
      }}
    >
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableOpacity>
  );

  return (
    <>
      <CenteredLoading loading={loading} />
      <Formik
        initialValues={{
          name: "",
          email: "",
          pswd: "",
          stallName: "",
          fnb: false,
        }}
        onSubmit={handleSubmitForm}
        validationSchema={RegisterSchema}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
        }) => (
          <View
            style={[
              styles.container,
              {
                height,
              },
            ]}
          >
            <CustomTextInput
              label="Tenant Name"
              returnKeyType="next"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              error={!!errors.name}
              errorText={errors.name}
              accessoryRight={(props) => {
                return (
                  !!errors.name && (
                    <Icon
                      {...props}
                      name="alert-circle-outline"
                      fill={theme["color-danger-700"]}
                    />
                  )
                );
              }}
            />
            <CustomTextInput
              label="Stall Name"
              returnKeyType="next"
              value={values.stallName}
              onChangeText={handleChange("stallName")}
              onBlur={handleBlur("stallName")}
              error={!!errors.stallName}
              errorText={errors.stallName}
              accessoryRight={(props) => {
                return (
                  !!errors.stallName && (
                    <Icon
                      {...props}
                      name="alert-circle-outline"
                      fill={theme["color-danger-700"]}
                    />
                  )
                );
              }}
            />
            <CustomTextInput
              label="Email"
              returnKeyType="next"
              value={values.email}
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              error={!!errors.email}
              errorText={errors.email}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              accessoryRight={(props) => {
                return (
                  !!errors.email && (
                    <Icon
                      {...props}
                      name="alert-circle-outline"
                      fill={theme["color-danger-700"]}
                    />
                  )
                );
              }}
            />
            <CustomTextInput
              label="Password"
              returnKeyType="done"
              value={values.pswd}
              onChangeText={handleChange("pswd")}
              onBlur={handleBlur("pswd")}
              error={!!errors.pswd}
              errorText={errors.pswd}
              secureTextEntry={secureTextEntry}
              accessoryRight={renderSecureIcon}
            />
            <View style={styles.toggleContainer}>
              <Toggle
                checked={checked}
                onChange={(val) => {
                  setFieldValue("fnb", val);
                  onCheckedChange(val);
                }}
              >
                {checked ? "FNB" : "NON-FNB"}
              </Toggle>
            </View>
            <View style={styles.buttonContainer}>
              <Button onPress={handleSubmit}>CREATE ACCOUNT</Button>
            </View>
          </View>
        )}
      </Formik>
    </>
  );
};

const styles = StyleService.create({
  container: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: Platform.select({ web: WEB_PADDINGTOP * 2 }),
  },
  buttonContainer: {
    flex: 1,
    marginBottom: MIN_HEADER_HEIGHT + 50,
    justifyContent: "flex-end",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});

export default AddTenantContent;
