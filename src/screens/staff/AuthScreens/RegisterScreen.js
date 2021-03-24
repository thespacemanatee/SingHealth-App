import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Button,
  Divider,
  Layout,
  TopNavigation,
  TopNavigationAction,
  Text,
  Icon,
  StyleService,
  useTheme,
} from "@ui-kitten/components";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../components/CustomTextInput";
import Logo from "../../../components/ui/Logo";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const RegisterScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const theme = useTheme();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Please enter your name!"),
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!"),
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
      }}
    >
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TopNavigation
          style={styles.topNavigation}
          title="Register"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout style={styles.layout}>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            onSubmit={(values) => {
              console.log(values);
              // dispatch(
              //   authActions.signIn(values.email, values.password, "staff")
              // );
            }}
            validationSchema={RegisterSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.keyboardContainer}>
                <Logo />
                <CustomTextInput
                  label="Name"
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
                    Sign Up
                  </Button>
                </View>
              </View>
            )}
          </Formik>
          <View style={styles.row}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("Login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </Layout>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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

export default RegisterScreen;
