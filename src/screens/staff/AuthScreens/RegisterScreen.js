import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
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
} from "@ui-kitten/components";
import { Formik } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../components/CustomTextInput";
import * as authActions from "../../../store/actions/authActions";
import Logo from "../../../components/ui/Logo";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />;

const RegisterScreen = ({ navigation }) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const theme = useTheme();

  const dispatch = useDispatch();

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TopNavigation
        title="Register"
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
                        name={"alert-circle-outline"}
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
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Button onPress={handleSubmit} style={{ marginTop: 24 }}>
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
  );
};

const styles = StyleService.create({
  keyboardContainer: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
  },
});

export default RegisterScreen;
