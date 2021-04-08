import React from "react";
import { Platform } from "react-native";
import { Button } from "@ui-kitten/components";
import { useLinkProps } from "@react-navigation/native";

// ...

const LinkButton = ({ to, action, children, ...rest }) => {
  const { onPress, ...props } = useLinkProps({ to, action });

  if (Platform.OS === "web") {
    // It's important to use a `View` or `Text` on web instead of `TouchableX`
    // Otherwise React Native for Web omits the `onClick` prop that's passed
    // You'll also need to pass `onPress` as `onClick` to the `View`
    // You can add hover effects using `onMouseEnter` and `onMouseLeave`
    return (
      <Button onClick={onPress} {...props} {...rest}>
        {children}
      </Button>
    );
  }

  return (
    <Button onPress={onPress} {...props} {...rest}>
      {children}
    </Button>
  );
};

export default LinkButton;
