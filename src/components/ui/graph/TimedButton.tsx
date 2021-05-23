import React from "react";
import { Pressable } from "react-native";
import { useTheme, StyleService } from "@ui-kitten/components";
import CustomText from "../CustomText";

const TimedButton = ({ id, pressed, onPress, children, ...props }) => {
  const theme = useTheme();

  const handlePress = () => {
    onPress(id);
  };

  return (
    <Pressable
      {...props}
      style={[
        styles.timeFrameButton,
        // eslint-disable-next-line react-native/no-inline-styles
        {
          backgroundColor:
            pressed === id ? theme["color-primary-400"] : "white",
        },
      ]}
      onPress={handlePress}
    >
      <CustomText
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          color: pressed === id ? "white" : theme["color-primary-400"],
        }}
      >
        {children}
      </CustomText>
    </Pressable>
  );
};

export default TimedButton;

const styles = StyleService.create({
  timeFrameButton: {
    borderRadius: 5,
    padding: 5,
  },
});
