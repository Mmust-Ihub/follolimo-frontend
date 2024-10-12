import { Colors } from "@/constants/Colors";
import React, { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";

const Page = () => {
  const [selected, setSelected] = useState("");

  return (
    <Calendar
      style={{
        borderRadius: 10,
        overflow: "hidden",
        backgroundColor: Colors.light.background,
        
      }}
      onDayPress={(day) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: Colors.light.tabIconSelected,
        },
      }}
    />
  );
};

export default Page;
