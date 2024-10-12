import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import {withLayoutContext} from 'expo-router'
import React from 'react'
import { Stack } from 'expo-router'
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
> (Navigator)

const Layout = () => {
  return (
    <MaterialTopTabs
      screenOptions={{
        tabBarActiveTintColor: Colors.darkGreen,
        tabBarIndicatorStyle: {
          backgroundColor: Colors.light.tabIconSelected,
          height: 3,
        },
        tabBarLabelStyle: { 
          fontWeight: 'bold',
          textTransform: 'capitalize'
        }
      }}
    >
      <MaterialTopTabs.Screen options={{ title: "My spending" }} name="index" />
      <MaterialTopTabs.Screen
        options={{ title: "My Calendars" }}
        name="Calendar"
      />
      <MaterialTopTabs.Screen
        options={{ title: "My Farms" }}
        name="MyFarms"
      />
    </MaterialTopTabs>
  );
}

export default Layout