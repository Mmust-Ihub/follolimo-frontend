import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function Calendar() {
  
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode ?? false;
  const color = isDarkMode ? Colors.dark : Colors.light;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color.background,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: color.text,
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 50,
        }}
      >
        My Calendar
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})