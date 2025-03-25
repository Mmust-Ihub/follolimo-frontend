import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import PhotoCamera from '../components/PhotoCamera';

export default function scan() {
  const [cropImage, setCropImage] = useState(null)
  return (
    <SafeAreaView className='flex-1'>
      <PhotoCamera  />
    </SafeAreaView>
  );
}