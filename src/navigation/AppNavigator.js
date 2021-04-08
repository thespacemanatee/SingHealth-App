import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleService } from "@ui-kitten/components";

import StaffNavigator from "./StaffNavigator";
import TenantNavigator from "./TenantNavigator";
import AuthScreen from "../screens/AuthScreens/AuthScreen";
import LoginScreen from "../screens/AuthScreens/LoginScreen";
import RegisterScreen from "../screens/AuthScreens/RegisterScreen";
import ForgotPasswordScreen from "../screens/AuthScreens/ForgotPasswordScreen";
import CustomText from "../components/ui/CustomText";

const { Navigator, Screen } = createStackNavigator();

const AppNavigator = () => {
  const authStore = useSelector((state) => state.auth);

  const config = {
    screens: {
      StaffNavigator: {
        screens: {
          StaffModalStack: {
            screens: {
              StaffTabNavigator: {
                screens: {
                  StaffDashboardStack: {
                    screens: {
                      StaffDashboard: "staff/dashboard",
                      ChooseTenant: "staff/new-audit",
                      Checklist: "staff/new-audit/:auditID",
                      QuestionDetails: "staff/new-audit/details",
                      AuditSubmit: "staff/new-audit/submit",
                      Rectification: "staff/rectification/:auditID",
                      RectificationDetails: "staff/rectification/details",
                      StaffRectification: "staff/rectification/status",
                    },
                  },
                  StaffDirectoryStack: {
                    screens: {
                      Directory: "staff/directory",
                      TenantsDirectory:
                        "staff/directory/institution/:institutionID",
                      TenantInfo: "staff/directory/stall/:tenantID",
                      Rectification: "staff/directory/stall/:auditID",
                      RectificationDetails: "staff/directory/stall/details",
                      StaffRectification: "staff/directory/stall/status",
                    },
                  },
                },
              },
            },
          },
          AddTenantStack: {
            screens: {
              ManageTenantAccounts: "staff/manage-tenants",
              CreateTenant: "staff/manage-tenants/create",
              AddAccountDetails: "staff/manage-tenants/create/details",
            },
          },
        },
      },
      TenantNavigator: {
        screens: {
          TenantModalStack: {
            screens: {
              TenantTabNavigator: {
                screens: {
                  TenantDashboardStack: {
                    screens: {
                      TenantDashboard: "tenant/dashboard",
                      Rectification: "tenant/rectification/:auditID",
                      RectificationDetails: "tenant/rectification/details",
                      TenantRectification: "tenant/rectification/status",
                    },
                  },
                  TenantRecordsStack: {
                    screens: {
                      TenantRecords: "tenant/records",
                      Rectification: "tenant/records/rectification/:auditID",
                      RectificationDetails:
                        "tenant/records/rectification/:stallName/details",
                      TenantRectification:
                        "tenant/records/rectification/status",
                    },
                  },
                },
              },
            },
          },
        },
      },
      NotFound: "*",
    },
  };

  const linking = {
    prefixes: ["http://localhost:19006"],
    config,
  };

  const renderNavigator = () => {
    if (authStore.userType === "staff") {
      return (
        <Navigator headerMode="none">
          <Screen name="StaffNavigator" component={StaffNavigator} />
        </Navigator>
      );
    }
    if (authStore.userType === "tenant") {
      return (
        <Navigator headerMode="none">
          <Screen name="TenantNavigator" component={TenantNavigator} />
        </Navigator>
      );
    }
    return (
      <View style={styles.textContainer}>
        <CustomText style={styles.text}>
          A serious error has occurred. You should never see this page.
        </CustomText>
      </View>
    );
  };
  console.log(authStore);

  return (
    <NavigationContainer linking={linking}>
      {authStore.userToken === null ? (
        <SafeAreaView style={styles.screen}>
          <Navigator headerMode="none">
            <Screen name="Auth" component={AuthScreen} />
            <Screen name="Login" component={LoginScreen} />
            <Screen name="Register" component={RegisterScreen} />
            <Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </Navigator>
        </SafeAreaView>
      ) : (
        renderNavigator()
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleService.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "bold",
  },
});
