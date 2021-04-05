import React from "react";
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
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
import CustomDatepicker from "../../../components/CustomDatePicker";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const AddAccountDetails = ({ navigation }) => {
  const theme = useTheme();

  const handleSubmitForm = async (values) => {
    console.log(values);
    // navigation.navigate("AddAccountDetails", { values });
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
    stallName: Yup.string().required("Please enter tenant's stall name!"),
    companyName: Yup.string().required("Please enter tenant's company name!"),
    companyPOCName: Yup.string().required(
      "Please enter tenant's company POC name!"
    ),
    companyPOCEmail: Yup.string()
      .email("Invalid email!")
      .required("Please enter tenant's POC email!"),
    unitNo: Yup.string().required("Please enter tenant's unit no.!"),
    fnb: Yup.boolean().required(
      "Please indicate if the stall is FNB or non-FNB!"
    ),
    tenantDateStart: Yup.date().required("Please enter tenant's start date!"),
    tenantDateEnd: Yup.date().required("Please enter tenant's end date!"),
    block: Yup.string().optional(),
    street: Yup.string().optional(),
    building: Yup.string().optional(),
    zipCode: Yup.number().optional(),
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (Platform.OS !== "web") {
          Keyboard.dismiss();
        }
      }}
    >
      <KeyboardAwareScrollView style={styles.screen}>
        <TopNavigation
          title="Account Details"
          alignment="center"
          accessoryLeft={BackAction}
        />
        <Divider />
        <Layout style={styles.layout}>
          <Formik
            initialValues={{ stallName: "", email: "", password: "" }}
            onSubmit={handleSubmitForm}
            validationSchema={RegisterSchema}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View style={styles.keyboardContainer}>
                <Logo />
                <CustomTextInput
                  label="Stall Name"
                  returnKeyType="next"
                  value={values.stallName}
                  onChangeText={handleChange("stallName")}
                  onBlur={handleBlur("stallName")}
                  error={!!errors.stallName}
                  errorText={errors.stallName}
                  accessoryRight={(props) => {
                    return (
                      !!errors.stallName && (
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
                  label="Company Name"
                  returnKeyType="next"
                  value={values.companyName}
                  onChangeText={handleChange("companyName")}
                  onBlur={handleBlur("companyName")}
                  error={!!errors.companyName}
                  errorText={errors.companyName}
                  accessoryRight={(props) => {
                    return (
                      !!errors.companyName && (
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
                  label="Company POC Name"
                  returnKeyType="next"
                  value={values.companyPOCName}
                  onChangeText={handleChange("companyPOCName")}
                  onBlur={handleBlur("companyPOCName")}
                  error={!!errors.companyPOCName}
                  errorText={errors.companyPOCName}
                  accessoryRight={(props) => {
                    return (
                      !!errors.companyPOCName && (
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
                  label="Company POC Email"
                  returnKeyType="next"
                  value={values.companyPOCEmail}
                  onChangeText={handleChange("companyPOCEmail")}
                  onBlur={handleBlur("companyPOCEmail")}
                  error={!!errors.companyPOCEmail}
                  errorText={errors.companyPOCEmail}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  accessoryRight={(props) => {
                    return (
                      !!errors.companyPOCEmail && (
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
                  label="Unit No."
                  returnKeyType="next"
                  value={values.unitNo}
                  onChangeText={handleChange("unitNo")}
                  onBlur={handleBlur("unitNo")}
                  error={!!errors.unitNo}
                  errorText={errors.unitNo}
                  accessoryRight={(props) => {
                    return (
                      !!errors.unitNo && (
                        <Icon
                          {...props}
                          name="alert-circle-outline"
                          fill={theme["color-danger-700"]}
                        />
                      )
                    );
                  }}
                />
                <CustomDatepicker label="Tenant Start Date" />
                <CustomDatepicker label="Tenant End Date" />
                <View style={styles.buttonContainer}>
                  <Button onPress={handleSubmit} style={styles.button}>
                    Add Account Details
                  </Button>
                </View>
              </View>
            )}
          </Formik>
        </Layout>
      </KeyboardAwareScrollView>
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

export default AddAccountDetails;
