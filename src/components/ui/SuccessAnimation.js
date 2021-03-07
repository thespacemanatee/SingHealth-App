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

class SuccessAnimation extends React.Component {
  componentDidMount() {
    if (this.props.loading) {
      this.animation.play(0, 50);
    } else {
      this.animation.play();
    }
  }

  render() {
    return (
      <Lottie
        ref={(animation) => {
          this.animation = animation;
        }}
        loop={this.props.loading}
        source={require("../../../assets/success.json")}
      />
    );
    // }
  }
}

export default SuccessAnimation;
