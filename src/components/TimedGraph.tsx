/* eslint-disable react-native/no-inline-styles */
import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import moment, { Moment } from "moment";
import { useNavigation } from "@react-navigation/native";
import useMountedState from "react-use/lib/useMountedState";

import Graph from "./ui/graph";
import Axis from "./ui/graph/Axis";
import TimedButton from "./ui/graph/TimedButton";
import * as databaseActions from "../store/actions/databaseActions";
import { handleErrorResponse } from "../helpers/utils";

const TimedGraph = ({ label, type, id }) => {
  const databaseStore = useSelector((state) => state.database);
  const [buttonPressed, setButtonPressed] = useState<number>(0);
  const [graphLoading, setGraphLoading] = useState<boolean>(true);
  const [graphData, setGraphData] = useState<any>();
  const [startX, setStartX] = useState<Moment>();
  const [endX, setEndX] = useState<Moment>();

  const isMounted = useMountedState();

  const navigation = useNavigation();

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

    if (isMounted()) {
      if (temp) {
        setStartX(moment(temp[0].x));
        setEndX(moment(temp[temp.length - 1].x));
      } else {
        setStartX(moment());
        setEndX(moment());
      }
      setGraphData(temp?.map((p) => [new Date(p.x).getTime(), p.y]));
    }
  }, [buttonPressed, databaseStore.graphData, isMounted]);

  const getGraphData = useCallback(async () => {
    try {
      setGraphLoading(true);

      const toDate = new Date().getTime();

      const res = await Promise.all([
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(1, "months").toDate().getTime(),
            toDate,
            type,
            id
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(3, "months").toDate().getTime(),
            toDate,
            type,
            id
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(6, "months").toDate().getTime(),
            toDate,
            type,
            id
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().startOf("year").toDate().getTime(),
            toDate,
            type,
            id
          )
        ),
        dispatch(
          databaseActions.getGraphData(
            moment().subtract(12, "months").toDate().getTime(),
            toDate,
            type,
            id
          )
        ),
      ]);

      res.forEach((e) => {
        e.data.data?.sort((a, b) => {
          return (
            moment(a.date).toDate().getTime() -
            moment(b.date).toDate().getTime()
          );
        });
      });

      const dataObject = {
        oneMonth: res[0].data.data?.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        threeMonths: res[1].data.data?.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        sixMonths: res[2].data.data?.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        ytd: res[3].data.data?.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
        oneYear: res[4].data.data?.map((e) => ({
          x: moment(e.date).toDate(),
          y: Number.parseFloat(e.avgScore) * 100,
        })),
      };

      dispatch(databaseActions.storeGraphData(dataObject));
    } catch (err) {
      dispatch(databaseActions.storeGraphData({}));
      if (isMounted()) {
        setGraphData(undefined);
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
    const onfocus = navigation.addListener("focus", () => {
      getGraphData();
    });
    return () => {
      // eslint-disable-next-line no-unused-expressions
      onfocus;
    };
  }, [getGraphData, navigation]);

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
});
