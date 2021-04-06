import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
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

  const handleSubmitForm = (credentials) => {
    console.log(credentials);
    navigation.navigate("AddAccountDetails", { credentials });
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
            initialValues={{ name: "", email: "", pswd: "" }}
            onSubmit={handleSubmitForm}
            validationSchema={RegisterSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
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
                <View style={styles.buttonContainer}>
                  <Button onPress={handleSubmit} style={styles.button}>
                    NEXT
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
});

export default AddTenantCredScreen;
