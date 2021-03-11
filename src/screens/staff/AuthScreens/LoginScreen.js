import React, { useState } from "react";
import { TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
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
} from "@ui-kitten/components";
import CustomTextInput from "../../../components/CustomTextInput";
import { emailValidator } from "../../../helpers/emailValidator";
import { passwordValidator } from "../../../helpers/passwordValidator";
import * as authActions from "../../../store/actions/authActions";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const dispatch = useDispatch();

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const onLoginPressed = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    dispatch(authActions.signIn(email, password, "staff"));
  };

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
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Welcome back.</Text>
        <View style={styles.keyboardContainer}>
          <CustomTextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <CustomTextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <View style={styles.forgotPassword}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgot}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>
          <Button mode="contained" onPress={onLoginPressed}>
            Login
          </Button>
        </View>
        <View style={styles.row}>
          <Text>Don’t have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace("Register")}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleService.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  keyboardContainer: {
    width: "100%",
    padding: 20,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
  },
  link: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
