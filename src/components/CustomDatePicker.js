import React, { useState, useEffect } from "react";
import { View, Platform } from "react-native";
import moment from "moment";
import { Datepicker, StyleService, useTheme } from "@ui-kitten/components";
import { MomentDateService } from "@ui-kitten/moment";
import CustomText from "./ui/CustomText";

const dateService = new MomentDateService();

const CustomDatepicker = ({
  deadline,
  onSelect,
  disabled,
  errorText,
  description,
  min,
  max,
  ...props
}) => {
  const [date, setDate] = useState(moment());

  const theme = useTheme();

  useEffect(() => {
    if (deadline) {
      setDate(moment(deadline));
    }
  }, [deadline]);

  return (
    <View style={styles.container}>
      <Datepicker
        {...props}
        placeholder="Deadline"
        date={date}
        dateService={dateService}
        onSelect={(nextDate) => {
          onSelect(nextDate);
          setDate(nextDate);
        }}
        min={min ? moment(min) : null}
        max={max ? moment(max) : null}
        disabled={disabled}
      />
      {description && !errorText ? (
        <CustomText
          style={{
            ...styles.description,
            color: theme["color-basic-600"],
          }}
        >
          {description || " "}
        </CustomText>
      ) : null}
      <CustomText style={{ ...styles.error, color: theme["color-danger-700"] }}>
        {errorText || " "}
      </CustomText>
    </View>
  );
};

const styles = StyleService.create({
  container: {
    width: "100%",
    marginVertical: 12,
  },
  description: {
    fontSize: 12,
    paddingTop: 8,
    position: Platform.OS !== "web" ? "absolute" : "relative",
    bottom: 0,
  },
  error: {
    fontSize: 12,
    paddingTop: 8,
  },
});

export default CustomDatepicker;
