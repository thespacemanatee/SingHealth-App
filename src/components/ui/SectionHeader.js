import React from "react";
import { View } from "react-native";
import { StyleService, useTheme } from "@ui-kitten/components";
import CustomText from "./CustomText";

const SectionHeader = ({ title }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: theme["color-primary-300"],
        },
      ]}
    >
      <CustomText bold style={styles.header}>
        {title}
      </CustomText>
    </View>
  );
};

export default SectionHeader;

const styles = StyleService.create({
  headerContainer: {
    height: 50,
    justifyContent: "center",
  },
  header: {
    fontSize: 16,
    padding: 10,
  },
});
