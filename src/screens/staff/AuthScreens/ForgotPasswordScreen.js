import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
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
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!"),
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopNavigation
        title="Login"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Logo />
        <Formik
          initialValues={{ email: "" }}
          onSubmit={(values) => {
            console.log(values);
            // dispatch(
            //   authActions.signIn(values.email, values.password, "staff")
            // );
            navigation.navigate("Login");
          }}
          validationSchema={ForgotSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={styles.keyboardContainer}>
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
              <Button onPress={handleSubmit} style={{ marginTop: 16 }}>
                Send Instructions
              </Button>
            </View>
          )}
        </Formik>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleService.create({
  keyboardContainer: {
    width: "100%",
    padding: 20,
  },
});

export default ForgotPasswordScreen;
