import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import FarmCard from './FarmCard';
import { Colors } from '@/constants/Colors';

export default function MyFarms() {
  const farms = [
    {
      name: "Farm 1",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 2",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 3",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 4",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Farm 5",
      location: "Nairobi, Kenya",
      image: "https://picsum.photos/200/300",
    },
  ];
  return (
    <View>
      <View className="flex-row justify-between">
        <Text className="font-semibold">My Farms</Text>
        <Pressable>
          <Text
            style={{
              color: Colors.light.tabIconSelected,
              textDecorationLine: "underline",
            }}
          >
            View all
          </Text>
        </Pressable>
      </View>
      <ScrollView showsHorizontalScrollIndicator={false} horizontal>
        {farms.map((farm, index) => (
          <FarmCard key={index} {...farm} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({})