import { Colors } from "@/constants/Colors";
import { ThemeContext } from "@/contexts/ThemeContext";
import React, { useContext, useState } from "react";
import { Calendar } from "react-native-calendars";


const Page = () => {
  const [selected, setSelected] = useState('');
  const themeContext = useContext(ThemeContext);
  const isDarkMode = ThemeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Calendar
      style={{
        borderRadius: 10,
        overflow: "hidden",
        color: color.text,
      }}
      Theme={{
        backgroundColor: color.background,
        calendarBackground: color.background,
        textSectionTitleColor: color.text,
        textSectionTitleDisabledColor: color.textDisabled,
      }}
      onDayPress={(day) => {
        setSelected(day.dateString);
      }}
      markedDates={{
        [selected]: {
          selected: true,
          disableTouchEvent: true,
          selectedDotColor: color.tabIconSelected,
        },
      }}
    />
  );
};

export default Page;
