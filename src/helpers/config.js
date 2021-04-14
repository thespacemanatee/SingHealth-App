import { TransitionPresets } from "@react-navigation/stack";
import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("screen").width;
export const SCREEN_HEIGHT = Dimensions.get("screen").height;
export const stackTransition = {
  ...TransitionPresets.SlideFromRightIOS,
};
export const modalTransition = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
};
