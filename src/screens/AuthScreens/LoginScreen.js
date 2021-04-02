import React, { useState } from "react";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
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
  Toggle,
} from "@ui-kitten/components";

import { Formik } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../components/CustomTextInput";
import * as authActions from "../../store/actions/authActions";
import Logo from "../../components/ui/Logo";
import CenteredLoading from "../../components/ui/CenteredLoading";
import { handleErrorResponse } from "../../helpers/utils";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const LoginScreen = ({ route, navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const { expoToken } = route.params;

  console.log("EXPO TOKEN:", expoToken);

  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!"),
  });

  const handleSubmitForm = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      await dispatch(
        authActions.signIn(
          values.email,
          values.password,
          expoToken,
          checked ? "staff" : "tenant"
        )
      );
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleUserToggle = (isChecked) => {
    setChecked(isChecked);
  };

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
        <CenteredLoading loading={loading} />
        <TopNavigation
          style={styles.topNavigation}
          title="Login"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout style={styles.layout}>
          {/* {!loading ? ( */}
          <>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={handleSubmitForm}
              validationSchema={LoginSchema}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                <View style={styles.keyboardContainer}>
                  <Logo />
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
                  <View style={styles.forgotPassword}>
                    <Toggle checked={checked} onChange={handleUserToggle}>
                      {`Login as ${checked ? "Staff" : "Tenant"}`}
                    </Toggle>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("ForgotPassword")}
                    >
                      <Text style={styles.forgot}>Forgot your password?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleSubmit}>
                      Login
                    </Button>
                  </View>
                </View>
              )}
            </Formik>
            <View style={styles.row}>
              <Text>Don’t have an account? </Text>
              <TouchableOpacity onPress={() => navigation.replace("Register")}>
                <Text style={styles.link}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </>
          {/* ) : (
            <CenteredLoading />
          )} */}
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  forgotPassword: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
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
  forgot: {
    fontSize: 13,
  },
  link: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
