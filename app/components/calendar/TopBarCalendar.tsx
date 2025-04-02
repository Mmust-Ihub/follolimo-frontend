import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';

export default function TopBarCalendar() {
  return (
    <View style={styles.Container}>
        <Pressable style={{borderRadius: "50%", backgroundColor: Colors.lightGreen, padding: 10}}>
        <Ionicons name="search" size={24} color={Colors.light.background} />
        </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
    Container: {
        width: '100%',
        height: "10%",
        padding: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    
})