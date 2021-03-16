import React, { useState, useEffect } from "react";
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useDispatch } from "react-redux";
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
import CustomTextInput from "../../../components/CustomTextInput";
import Logo from "../../../components/ui/Logo";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ForgotPasswordScreen = ({ navigation }) => {
  const theme = useTheme();

  const ForgotSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email!").required("Please enter your email!"),
  });

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (Platform.OS !== "web") {
          Keyboard.dismiss();
        }
      }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TopNavigation
          style={{ zIndex: 5 }}
          title="Login"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout
          style={{
            flex: 1,
            alignItems: "center",
          }}>
          <Formik
            initialValues={{ email: "" }}
            onSubmit={(values) => {
              console.log(values);
              // dispatch(
              //   authActions.signIn(values.email, values.password, "staff")
              // );
              navigation.navigate("Login");
            }}
            validationSchema={ForgotSchema}>
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.keyboardContainer}>
                <Logo />
                <CustomTextInput
                  label="E-mail address"
                  returnKeyType="done"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={!!errors.email}
                  errorText={errors.email}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  description="You will receive email with password reset link."
                  accessoryRight={(props) => {
                    return (
                      !!errors.email && (
                        <Icon
                          {...props}
                          name={"alert-circle-outline"}
                          fill={theme["color-danger-700"]}
                        />
                      )
                    );
                  }}
                />
                <View style={styles.buttonContainer}>
                  <Button onPress={handleSubmit} style={{ marginTop: 16 }}>
                    Send Instructions
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </Layout>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleService.create({
  keyboardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    width: "100%",
    marginBottom: 20,
    justifyContent: "flex-end",
  },
});

export default ForgotPasswordScreen;
