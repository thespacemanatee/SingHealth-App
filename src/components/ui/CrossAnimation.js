import React from "react";
import LottieView from "lottie-react-native";
import { Platform } from "react-native";

let Lottie;

if (Platform.OS === "web") {
  import("react-native-web-lottie").then((res) => {
    console.log(res);
    Lottie = res.default;
  });
} else {
  Lottie = LottieView;
}

class CrossAnimation extends React.Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <Lottie
        ref={(animation) => {
          this.animation = animation;
        }}
        loop={this.props.loading}
        source={require("../../../assets/cross.json")}
      />
    );
    // }
  }
}

export default CrossAnimation;
