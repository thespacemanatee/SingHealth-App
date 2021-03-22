import React, { useState, useEffect } from "react";

import moment from "moment";
import { Datepicker } from "@ui-kitten/components";
import { MomentDateService } from "@ui-kitten/moment";

const dateService = new MomentDateService();

const CustomDatepicker = (props) => {
  const { deadline } = props;
  const { onSelect } = props;
  const [date, setDate] = useState(
    moment(
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 7
      )
    )
  );

  useEffect(() => {
    if (deadline) {
      setDate(deadline);
    }
  }, [deadline]);

  const now = new Date();
  const max = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 31);

  return (
    <Datepicker
      placeholder="Deadline"
      date={date}
      dateService={dateService}
      onSelect={(nextDate) => {
        onSelect(nextDate);
        setDate(nextDate);
      }}
      min={moment(now)}
      max={moment(max)}
    />
  );
};

export default CustomDatepicker;
