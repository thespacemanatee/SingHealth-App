import React from "react";
import { View, Platform } from "react-native";
import {
  Divider,
  Layout,
  TopNavigation,
  StyleService,
  Icon,
  TopNavigationAction,
} from "@ui-kitten/components";
import CustomText from "../components/ui/CustomText";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;

const NotificationsScreen = ({ navigation }) => {
  const BackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => {
        if (Platform.OS === "web") {
          window.history.back();
        } else {
          navigation.goBack();
        }
      }}
    />
  );

  return (
    <View style={styles.screen}>
      <TopNavigation
        title="Notifications"
        alignment="center"
        accessoryLeft={BackAction}
      />
      <Divider />
      <Layout style={styles.layout}>
        <View>
          <CustomText>Hello</CustomText>
        </View>
      </Layout>
    </View>
  );
};

const styles = StyleService.create({
  screen: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    marginBottom: 10,
  },
});

export default NotificationsScreen;
