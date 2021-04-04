import React from "react";
import { View } from "react-native";
import { StyleService, Divider, useTheme } from "@ui-kitten/components";
import CustomText from "./CustomText";

const SectionHeader = ({ title }) => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme["color-primary-300"] }}>
      <CustomText bold style={styles.header}>
        {title}
      </CustomText>
      <Divider />
    </View>
  );
};

export default SectionHeader;

const styles = StyleService.create({
  header: {
    fontSize: 20,
    padding: 10,
  },
});
