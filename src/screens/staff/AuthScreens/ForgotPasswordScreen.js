import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
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

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ value: "", error: "" });

  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        navigation.goBack();
      }}
    />
  );

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }
    navigation.navigate("LoginScreen");
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
        <View style={styles.keyboardContainer}>
          <CustomTextInput
            label="E-mail address"
            returnKeyType="done"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            description="You will receive email with password reset link."
          />
          <Button onPress={sendResetPasswordEmail} style={{ marginTop: 16 }}>
            Send Instructions
          </Button>
        </View>
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
