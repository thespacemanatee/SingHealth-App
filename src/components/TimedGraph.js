/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { useTheme } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
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
  const databaseStore = useSelector((state) => state.database);
  const [buttonPressed, setButtonPressed] = useState(0);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphData, setGraphData] = useState();

  const dispatch = useDispatch();

  const handlePress = (index) => {
    setButtonPressed(index);
  };

  const renderGraph = useCallback(() => {
    let temp;
    if (buttonPressed === 0) {
      temp = databaseStore.graphData.oneMonth;
    } else if (buttonPressed === 1) {
      temp = databaseStore.graphData.threeMonths;
    } else if (buttonPressed === 2) {
      temp = databaseStore.graphData.sixMonths;
    } else if (buttonPressed === 3) {
      temp = databaseStore.graphData.ytd;
    } else if (buttonPressed === 4) {
      temp = databaseStore.graphData.oneYear;
    }

    if (temp) {
      setGraphData(temp.map((p) => [new Date(p.x).getTime(), p.y]));
    }
  }, [buttonPressed, databaseStore.graphData]);

  const getGraphData = async () => {
    try {
      const toDate = new Date().getTime();

      const res = await Promise.all([
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(1, "months").toDate().getTime(),
            toDate
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(3, "months").toDate().getTime(),
            toDate
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(6, "months").toDate().getTime(),
            toDate
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().startOf("year").toDate().getTime(),
            toDate
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(12, "months").toDate().getTime(),
            toDate
          )
        ),
      ]);

      res.forEach((e) => {
        e.data.data.sort((a, b) => {
          return (
            moment(a.date).toDate().getTime() -
            moment(b.date).toDate().getTime()
          );
        });
      });

      const dataObject = {
        oneMonth: res[0].data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        threeMonths: res[1].data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        sixMonths: res[2].data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        ytd: res[3].data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        oneYear: res[4].data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
      };

      dispatch(databaseActions.storeGraphData(dataObject));
    } catch (err) {
      handleErrorResponse(err);
    } finally {
      setGraphLoading(false);
    }
  };

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  useEffect(() => {
    getGraphData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Graph label={label} data={graphData} loading={graphLoading} />
      {/* TODO: Add axis labels */}
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
    marginVertical: 10,
  },
  timeFrameButton: {
    borderRadius: 5,
    padding: 5,
  },
});
