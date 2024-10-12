import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MonthPicker from '@/app/components/calendar/MonthPicker'

export default function Calendar() {
  return (
    <View>
      <MonthPicker />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})