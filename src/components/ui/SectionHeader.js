import React from "react";
import { Text, View } from "react-native";
import { StyleService, Divider, useTheme } from "@ui-kitten/components";

const SectionHeader = ({ title }) => {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme["color-primary-300"] }}>
      <Text style={styles.header}>{title}</Text>
      <Divider />
    </View>
  );
};

export default SectionHeader;

const styles = StyleService.create({
  header: {
    fontSize: 20,
    padding: 10,
    fontWeight: "bold",
  },
});
