import { TransitionPresets } from "@react-navigation/stack";
import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const IMAGE_WIDTH = SCREEN_WIDTH * 0.8;
export const IMAGE_HEIGHT = (IMAGE_WIDTH / 3) * 4;
export const stackTransition = {
  ...TransitionPresets.SlideFromRightIOS,
};
export const modalTransition = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
};
