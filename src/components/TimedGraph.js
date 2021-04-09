/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { useTheme } from "@ui-kitten/components";
import { useDispatch } from "react-redux";
import moment from "moment";

import * as databaseActions from "../store/actions/databaseActions";
import { handleErrorResponse } from "../helpers/utils";

import CustomText from "./ui/CustomText";
import Graph from "./ui/graph";

const TimedButton = ({ id, pressed, onPress, children, ...props }) => {
  const theme = useTheme();

  const handlePress = () => {
    onPress(id);
  };

  return (
    <Pressable
      {...props}
      style={[
        styles.timeFrameButton,
        {
          backgroundColor:
            pressed === id ? theme["color-primary-400"] : "white",
        },
      ]}
      onPress={handlePress}
    >
      <CustomText
        style={{
          color: pressed === id ? "white" : theme["color-primary-400"],
        }}
      >
        {children}
      </CustomText>
    </Pressable>
  );
};

const TimedGraph = ({ label }) => {
  const [buttonPressed, setButtonPressed] = useState(0);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphData, setGraphData] = useState();

  const dispatch = useDispatch();

  const handlePress = (index) => {
    setButtonPressed(index);
  };

  const getGraphData = useCallback(async () => {
    try {
      setGraphLoading(true);

      let fromDate;
      const toDate = new Date().getTime();

      if (buttonPressed === 0) {
        fromDate = moment().subtract(1, "months").toDate().getTime();
      } else if (buttonPressed === 1) {
        fromDate = moment().subtract(3, "months").toDate().getTime();
      } else if (buttonPressed === 2) {
        fromDate = moment().subtract(6, "months").toDate().getTime();
      } else if (buttonPressed === 3) {
        fromDate = moment().startOf("year").toDate().getTime();
      } else if (buttonPressed === 4) {
        fromDate = moment().subtract(12, "months").toDate().getTime();
      }

      const res = await dispatch(
        databaseActions.getGraphData(fromDate, toDate)
      );
      res.data.data.sort((a, b) => {
        console.log("a:", a, "b", b);
        return (
          moment(a.date).toDate().getTime() - moment(b.date).toDate().getTime()
        );
      });
      const temp = res.data.data.map((e) => ({
        x: moment(e.date).toDate(),
        y: Number.parseFloat(e.avgScore) * 100,
      }));
      console.log(temp.map((p) => [p.x.getTime(), p.y]));
      setGraphData(temp.map((p) => [p.x.getTime(), p.y]));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setGraphLoading(false);
    }
  }, [buttonPressed, dispatch]);

  useEffect(() => {
    getGraphData();
  }, [getGraphData]);

  return (
    <>
      <Graph label={label} data={graphData} loading={graphLoading} />
      <View style={styles.timeFrameContainer}>
        <TimedButton id={0} pressed={buttonPressed} onPress={handlePress}>
          1M
        </TimedButton>
        <TimedButton id={1} pressed={buttonPressed} onPress={handlePress}>
          3M
        </TimedButton>
        <TimedButton id={2} pressed={buttonPressed} onPress={handlePress}>
          6M
        </TimedButton>
        <TimedButton id={3} pressed={buttonPressed} onPress={handlePress}>
          YTD
        </TimedButton>
        <TimedButton id={4} pressed={buttonPressed} onPress={handlePress}>
          1Y
        </TimedButton>
      </View>
    </>
  );
};

export default TimedGraph;

const styles = StyleSheet.create({
  timeFrameContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  timeFrameButton: {
    borderRadius: 5,
    padding: 5,
  },
});
