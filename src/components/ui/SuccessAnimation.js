import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

const SuccessAnimation = (props) => {
  const animation = useRef(null);

  useEffect(() => {
    console.log(props.loading);
    if (props.loading) {
      animation.current.play(0, 25);
    } else {
      animation.current.reset();
      animation.current.play();
    }
  }, [props.loading]);

  return (
    <View style={styles.animationContainer}>
      <LottieView
        ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../../../assets/success.json")}
        loop={props.loop}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // flex: 1,
    // backgroundColor: "red"
  },
});

export default SuccessAnimation;
