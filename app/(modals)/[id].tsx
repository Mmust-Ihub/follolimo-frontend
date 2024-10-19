import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { FarmData } from '@/constants/Types';

export default function Page() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [farmData, setFarmData] = useState <FarmData | null>();

  useEffect(() => {
    navigation.setOptions({
      title: `More about Farm ${id}`,
    });

    // Fetch data for the farm with the given id from firebase


  }, [id]);
  const FetchData = async () => {
    //fetch from firebase
    const query = collection(db, "fololimo");
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const cropData: FarmData[] = snapshot.docs
        .filter((doc) => doc.data().user_id === id)
        .map((doc) => doc.data() as FarmData);
    });

  }
  return (
    <View>
      <Text>Page{id}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})