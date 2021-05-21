/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { useTheme } from "@ui-kitten/components";
import moment from "moment";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigation } from "@react-navigation/native";
import useMountedState from "react-use/lib/useMountedState";

import { handleErrorResponse } from "../helpers/utils";

import CustomText from "./ui/CustomText";
import Graph from "./ui/graph";
import {
  getGraphData,
  storeGraphData,
} from "../features/database/databaseSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const Axis = ({ startX, endX }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingTop: 10,
        opacity: 0.75,
      }}
    >
      <CustomText>{moment.months(startX?.month())}</CustomText>
      <CustomText>{moment.months(endX?.month())}</CustomText>
    </View>
  );
};

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

const TimedGraph = ({ label, type, id }) => {
  const databaseStore = useAppSelector((state) => state.database);
  const [buttonPressed, setButtonPressed] = useState(0);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphData, setGraphData] = useState(null);
  const [startX, setStartX] = useState(null);
  const [endX, setEndX] = useState(null);

  const isMounted = useMountedState();

  const navigation = useNavigation();

  const dispatch = useAppDispatch();

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

    if (isMounted()) {
      if (temp) {
        setStartX(moment(temp[0].x));
        setEndX(moment(temp[temp.length - 1].x));
        setGraphData(temp.map((p) => [new Date(p.x).getTime(), p.y]));
      } else {
        setStartX(moment());
        setEndX(moment());
      }
    }
  }, [buttonPressed, databaseStore.graphData, isMounted]);

  const getData = useCallback(async () => {
    try {
      setGraphLoading(true);

      const toDate = new Date().getTime();

      let res;

      await Promise.all([
        dispatch(
          getGraphData({
            fromDate: moment().subtract(1, "months").toDate().getTime(),
            toDate,
            dataType: type,
            dataID: id,
          })
        ),
        dispatch(
          getGraphData({
            fromDate: moment().subtract(3, "months").toDate().getTime(),
            toDate,
            dataType: type,
            dataID: id,
          })
        ),
        dispatch(
          getGraphData({
            fromDate: moment().subtract(6, "months").toDate().getTime(),
            toDate,
            dataType: type,
            dataID: id,
          })
        ),
        dispatch(
          getGraphData({
            fromDate: moment().startOf("year").toDate().getTime(),
            toDate,
            dataType: type,
            dataID: id,
          })
        ),
        dispatch(
          getGraphData({
            fromDate: moment().subtract(12, "months").toDate().getTime(),
            toDate,
            dataType: type,
            dataID: id,
          })
        ),
      ])
        .then(unwrapResult)
        .then((r) => {
          res = r;
        });

      res.forEach((e) => {
        e.data.data?.sort((a, b) => {
          return (
            moment(a.date).toDate().getTime() -
            moment(b.date).toDate().getTime()
          );
        });
      });

      const dataObject = {
        oneMonth: res[0]?.data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        threeMonths: res[1]?.data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        sixMonths: res[2]?.data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        ytd: res[3]?.data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        oneYear: res[4]?.data.data.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
      };

      dispatch(storeGraphData(dataObject));
    } catch (err) {
      dispatch(storeGraphData({}));
      if (isMounted()) {
        setGraphData(null);
      }
      handleErrorResponse(err);
    } finally {
      if (isMounted()) {
        setGraphLoading(false);
      }
    }
  }, [dispatch, id, isMounted, type]);

  useEffect(() => {
    renderGraph();
  }, [renderGraph]);

  useEffect(() => {
    getData();
    const unsubscribe = navigation.addListener("focus", () => {
      getData();
    });
    return () => {
      // eslint-disable-next-line no-unused-expressions
      unsubscribe;
    };
  }, [getData, navigation]);

  return (
    <>
      <Graph label={label} data={graphData} loading={graphLoading} />
      <Axis startX={startX} endX={endX} />
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
