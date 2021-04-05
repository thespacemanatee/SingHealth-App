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
} from "@ui-kitten/components";
import { Formik } from "formik";
import * as Yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomTextInput from "../../../components/CustomTextInput";
import Logo from "../../../components/ui/Logo";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const AddTenantCredScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const theme = useTheme();

  const handleSubmitForm = async (values) => {
    console.log(values);
    navigation.navigate("AddAccountDetails", { values });
  };

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const RegisterSchema = Yup.object().shape({
    tenantName: Yup.string().required("Please enter tenant name!"),
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter tenant's email!"),
    password: Yup.string()
      .required("Please enter your password!")
      .min(8, "Password is too short - should be 8 chars minimum."),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
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
      <KeyboardAwareScrollView>
        <Layout style={styles.layout}>
          <Formik
            initialValues={{ tenantName: "", email: "", password: "" }}
            onSubmit={handleSubmitForm}
            validationSchema={RegisterSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.keyboardContainer}>
                <Logo />
                <CustomTextInput
                  label="Tenant Name"
                  returnKeyType="next"
                  value={values.tenantName}
                  onChangeText={handleChange("tenantName")}
                  onBlur={handleBlur("tenantName")}
                  error={!!errors.tenantName}
                  errorText={errors.tenantName}
                  accessoryRight={(props) => {
                    return (
                      !!errors.tenantName && (
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
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  error={!!errors.password}
                  errorText={errors.password}
                  secureTextEntry={secureTextEntry}
                  accessoryRight={renderSecureIcon}
                />
                <View style={styles.buttonContainer}>
                  <Button onPress={handleSubmit} style={styles.button}>
                    Next
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
  topNavigation: {
    zIndex: 5,
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
  row: {
    flexDirection: "row",
    marginBottom: 20,
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
  link: {
    fontWeight: "bold",
  },
});

export default AddTenantCredScreen;
