import React, { useState } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Icon,
  StyleService,
  useTheme,
  Toggle,
} from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { StackActions } from "@react-navigation/routers";

import CustomTextInput from "../../../components/CustomTextInput";
import Logo from "../../../components/ui/Logo";
import * as databaseActions from "../../../store/actions/databaseActions";
import { handleErrorResponse } from "../../../helpers/utils";
import CenteredLoading from "../../../components/ui/CenteredLoading";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const AddTenantCredScreen = ({ navigation }) => {
  const authStore = useSelector((state) => state.auth);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();

  const dispatch = useDispatch();

  const onCheckedChange = (isChecked) => {
    setChecked(isChecked);
  };

  const handleSubmitForm = async (values) => {
    try {
      setLoading(true);
      const data = {
        ...values,
        institutionID: authStore.institutionID,
        staffID: authStore._id,
      };
      console.log(data);
      const res = await dispatch(databaseActions.createNewTenant(data));

      console.log(res);

      Toast.show({
        text1: "Success",
        text2: `You have successfully added ${values.stallName} to the database!`,
      });

      navigation.dispatch(StackActions.popToTop());
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setLoading(false);
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

  const renderSecureIcon = (props) => (
    <TouchableOpacity
      onPress={() => {
        setSecureTextEntry(!secureTextEntry);
      }}
    >
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Add Tenant"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <CenteredLoading loading={loading} />
      <KeyboardAwareScrollView>
        <Layout style={styles.layout}>
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
              <View style={styles.keyboardContainer}>
                <Logo />
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
                  <Button onPress={handleSubmit} style={styles.button}>
                    CREATE ACCOUNT
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </Layout>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    alignItems: "center",
  },
  keyboardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
    justifyContent: "flex-end",
  },
  button: {
    marginTop: 24,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
  },
});

export default AddTenantCredScreen;
