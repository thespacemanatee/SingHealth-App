import React from "react";
import { View } from "react-native";
import { StyleService } from "@ui-kitten/components";
import moment from "moment";

import CustomText from "../CustomText";

const Axis = ({ startX, endX }) => {
  return (
    <View style={styles.axis}>
      <CustomText>{moment.months(startX?.month())}</CustomText>
      <CustomText>{moment.months(endX?.month())}</CustomText>
    </View>
  );
};

export default Axis;

const styles = StyleService.create({
  axis: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
    opacity: 0.75,
  },
});
