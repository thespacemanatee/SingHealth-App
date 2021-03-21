import React from "react";
import { StyleSheet } from "react-native";
import moment from "moment";
import { Datepicker, Layout } from "@ui-kitten/components";
import { MomentDateService } from "@ui-kitten/moment";

const dateService = new MomentDateService();

const CustomDatepicker = () => {
  const [date, setDate] = React.useState(moment());

  return (
    <Layout style={styles.container} level="1">
      <Datepicker
        placeholder="Pick Date"
        date={date}
        dateService={dateService}
        onSelect={(nextDate) => setDate(nextDate)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 360,
  },
});

export default CustomDatepicker;
