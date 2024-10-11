import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
type Farm = {
    name: string;
    location: string;
    image: string;
    };
export default function FarmCard({name, location, image}: Farm) {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: image }} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.location}>
        <Ionicons name="location-sharp" size={16} color="gray" />
        {location}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 200,
        borderRadius: 20,
        backgroundColor: Colors.lightGreen,
        margin: 10,
        padding: 10,
    },
    image: {
        width: 180,
        height: 120,
        borderRadius: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    location: {
        fontSize: 14,
        marginTop: 5,
        color: 'gray',
    },
})