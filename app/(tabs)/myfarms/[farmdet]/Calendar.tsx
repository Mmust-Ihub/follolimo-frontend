import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarView from '@/app/components/calendar/calendarView';
export default function Calendar() {
  
  return (
    <View
      style={styles.container}
    >
     <LinearGradient
        // Background Linear Gradient
        colors={[Colors.linearGreen, Colors.lineardarkGreen]}
        style={[styles.section, {borderBottomRightRadius: 20, height: "60%", borderBottomLeftRadius: 20, zIndex: 10, elevation: 6, backgroundColor: Colors.light.background}]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        locations={[0.1, .7]}
        
        />
     <View style={[styles.section, {backgroundColor: Colors.light.background}]} />
     <CalendarView/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  section: {
    width: '100%',
    height: '50%',
  }
})