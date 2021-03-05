import React from "react";
import LottieView from "lottie-react-native";

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
      <LottieView
        ref={(animation) => {
          this.animation = animation;
        }}
        loop={this.props.loading}
        source={require("../../../assets/success.json")}
      />
    );
  }
}

export default SuccessAnimation;
