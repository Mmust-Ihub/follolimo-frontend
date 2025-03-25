import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import MonthPicker from '@/app/components/calendar/MonthPicker'
import { ThemeContext } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function Calendar() {
  
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: color.background,
        },
      ]}
    >
      <MonthPicker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})