import React from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

export default class SuccessAnimation extends React.Component {
  componentDidMount() {
    if (this.props.loading) {
      this.animation.play(0, 25);
    } else {
      this.animation.play();
    }
  }

  //   resetAnimation = () => {
  //     this.animation.reset();
  //     this.animation.play();
  //   };

  render() {
    return (
      <View style={styles.animationContainer}>
        <LottieView
          ref={(animation) => {
            this.animation = animation;
          }}
          style={{
            width: 200,
            height: 200,
          }}
          source={require("../../../assets/success.json")}
          loop={this.props.loop}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  animationContainer: {
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    // flex: 1,
    // backgroundColor: "red"
  },
});
