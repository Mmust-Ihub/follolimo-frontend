import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import {withLayoutContext} from 'expo-router'
import React from 'react'
import { Stack } from 'expo-router'
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

const { Navigator } = createMaterialTopTabNavigator()

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
> (Navigator)

const Layout = () => {
  return (
      <MaterialTopTabs></MaterialTopTabs>
  )
}

export default Layout