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
import alert from "../../components/CustomAlert";
import CenteredLoading from "../../components/ui/CenteredLoading";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const LoginScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

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
          checked ? "staff" : "tenant"
        )
      );
    } catch (err) {
      setLoading(false);
      handleErrorResponse(err);
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

  const handleErrorResponse = (err) => {
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data } = err.response;
      console.error(err.response.data);
      console.error(err.response.status);
      console.error(err.response.headers);
      if (err.response.status === 403) {
        dispatch(authActions.signOut());
      } else {
        switch (Math.floor(err.response.status / 100)) {
          case 4: {
            alert(
              "Invalid Login",
              "You have entered the wrong credentials. Check if you are signing in as a Tenant or Staff"
            );
            break;
          }
          case 5: {
            alert("Server Error", "Please contact your administrator.");
            break;
          }
          default: {
            alert("Request timeout", "Check your internet connection.");
            break;
          }
        }
      }
    } else if (err.request) {
      console.error(err.request);
    } else {
      console.error("Error", err.message);
    }
    console.error(err.config);
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
