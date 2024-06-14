import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import GalleryScreen from './screens/GalleryScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Gallery" component={GalleryScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
