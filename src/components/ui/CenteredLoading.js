import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { StyleService, useTheme } from "@ui-kitten/components";
import { Dialog, Portal } from "react-native-paper";

const CenteredLoading = ({ loading }) => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const theme = useTheme();

  useEffect(() => {
    console.log("LOADING:", loading);
    if (!loading) {
      hideDialog();
    } else {
      showDialog();
    }
  }, [loading]);
  return (
    <Portal>
      <Dialog visible={visible} dismissable={false} style={styles.dialog}>
        <Dialog.Content>
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color={theme["color-primary-default"]}
            />
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default CenteredLoading;

const styles = StyleService.create({
  dialog: {
    borderRadius: Platform.select({ ios: 12 }),
    // width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
