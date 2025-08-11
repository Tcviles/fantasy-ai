import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './src/screens/MenuScreen';
import ComparePlayersScreen from './src/screens/ComparePlayersScreen';
import DevScreen from './src/screens/DevScreen';
import { RootStackParamList } from './src/utils/types';
import KeeperCalculatorScreen from './src/screens/KeeperCalculatorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu" screenOptions={{headerShown: false}}>
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Compare" component={ComparePlayersScreen} />
        <Stack.Screen name="KeeperCalc" component={KeeperCalculatorScreen} />
        <Stack.Screen name="Dev" component={DevScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
