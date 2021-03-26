import React from "react";
import { LottieView } from "../..";

const sourceFile = require("../../../assets/cross.json");

class CrossAnimation extends React.Component {
  componentDidMount() {
    this.animation.play();
  }

  render() {
    return (
      <LottieView
        style={{ height: 160, width: 160 }}
        ref={(animation) => {
          this.animation = animation;
        }}
        // eslint-disable-next-line react/destructuring-assignment
        loop={this.props.loading}
        source={sourceFile}
        resizeMode="cover"
      />
    );
    // }
  }
}

export default CrossAnimation;
