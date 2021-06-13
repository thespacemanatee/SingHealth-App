import React, { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  Icon,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Cover from "../../../components/createTenant/Cover";
import Content from "../../../components/createTenant/Content";

const BackIcon = (props) => <Icon {...props} name="arrow-back" />;
const ImageIcon = (props) => <Icon {...props} name="image-outline" />;

const CreateTenantScreen = ({ navigation }) => {
  const y = useSharedValue(0);
  const [imageAdded, setImageAdded] = useState<ImagePicker.ImagePickerResult>();

  const insets = useSafeAreaInsets();

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageAdded(result);
    }
  };

  const ImageAction = () => (
    <TopNavigationAction icon={ImageIcon} onPress={handleAddImage} />
  );

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
    <View style={styles.container}>
      <TopNavigation
        accessoryLeft={BackAction}
        accessoryRight={ImageAction}
        style={[styles.header, { paddingTop: insets.top }]}
      />
      <Cover {...{ y, imageAdded }} />
      <Content {...{ navigation, y, imageAdded }} />
    </View>
  );
};

export default CreateTenantScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    zIndex: 1,
    position: "absolute",
    backgroundColor: "transparent",
    width: "100%",
  },
});
