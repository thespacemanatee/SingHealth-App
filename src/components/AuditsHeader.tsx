import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  StyleService,
  OverflowMenu,
  MenuItem,
} from "@ui-kitten/components";

import CustomText from "./ui/CustomText";

const AuditsHeader = ({
  label,
  onNewestPress,
  onOldestPress,
  onIncreasingScorePress,
  onDecreasingScorePress,
}: {
  label: string;
  onNewestPress: (type: string) => void;
  onOldestPress: (type: string) => void;
  onIncreasingScorePress: (type: string) => void;
  onDecreasingScorePress: (type: string) => void;
}) => {
  const [visible, setVisible] = useState(false);
  const [orderedBy, setOrderedBy] = useState("Oldest");

  const _onOldestPress = () => {
    onOldestPress("Oldest");
    setOrderedBy("Oldest");
    setVisible(false);
  };

  const _onNewestPress = () => {
    onNewestPress("Newest");
    setOrderedBy("Newest");
    setVisible(false);
  };

  const _onIncreasingScorePress = () => {
    onIncreasingScorePress("Increasing Score");
    setOrderedBy("Increasing");
    setVisible(false);
  };

  const _onDecreasingScorePress = () => {
    onDecreasingScorePress("Decreasing Score");
    setOrderedBy("Decreasing");
    setVisible(false);
  };

  const renderToggleButton = () => (
    <Button onPress={() => setVisible(!visible)} appearance="ghost">
      {`Order: ${orderedBy}`}
    </Button>
  );

  return (
    <View style={styles.textContainer}>
      <CustomText style={styles.text}>{label}</CustomText>

      <OverflowMenu
        visible={visible}
        anchor={renderToggleButton}
        onBackdropPress={() => setVisible(false)}
        placement="bottom end"
      >
        <MenuItem title="Oldest" onPress={_onOldestPress} />
        <MenuItem title="Newest" onPress={_onNewestPress} />
        <MenuItem title="Increasing Score" onPress={_onIncreasingScorePress} />
        <MenuItem title="Decreasing Score" onPress={_onDecreasingScorePress} />
      </OverflowMenu>
    </View>
  );
};

export default AuditsHeader;

const styles = StyleService.create({
  textContainer: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 26,
    fontFamily: "SFProDisplay-Bold",
  },
});
