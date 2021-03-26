import React from "react";
import { LottieView } from "../..";

const sourceFile = require("../../../assets/success.json");

class SuccessAnimation extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
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
        // eslint-disable-next-line react/destructuring-assignment
        loop={this.props.loading}
        source={sourceFile}
      />
    );
    // }
  }
}

export default SuccessAnimation;
