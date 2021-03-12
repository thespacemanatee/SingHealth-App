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
import CustomTextInput from "../../../components/CustomTextInput";
import * as authActions from "../../../store/actions/authActions";
import Logo from "../../../components/ui/Logo";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const LoginScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [checked, setChecked] = useState(false);
  const theme = useTheme();

  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email!")
      .required("Please enter your email!"),
    password: Yup.string()
      .required("Please enter your password!")
      .min(8, "Password is too short - should be 8 chars minimum."),
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
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              console.log(values);
              dispatch(
                authActions.signIn(
                  values.email,
                  values.password,
                  checked ? "staff" : "tenant"
                )
              );
            }}
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
                          name={"alert-circle-outline"}
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
                  <Toggle
                    checked={checked}
                    onChange={(isChecked) => {
                      setChecked(isChecked);
                    }}
                  >
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
        </Layout>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleService.create({
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