import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './src/screens/MenuScreen';
import ComparePlayersScreen from './src/screens/ComparePlayersScreen';
import DevScreen from './src/screens/DevScreen';
import { RootStackParamList } from './src/utils/types';
import KeeperCalculatorScreen from './src/screens/KeeperCalculatorScreen';
import CheatSheetScreen from './src/screens/CheatSheetScreen';
import EditCheatSheetScreen from './src/screens/EditCheatSheetScreen';
import CheatSheetChecklist from './src/components/CheatSheetChecklist';
import { AppContext, AppProvider } from './src/context/AppContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Menu" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Compare" component={ComparePlayersScreen} />
          <Stack.Screen name="KeeperCalc" component={KeeperCalculatorScreen} />
          <Stack.Screen name="CheatSheet" component={CheatSheetScreen} />
          <Stack.Screen name="EditCheatSheet" component={EditCheatSheetScreen} />
          <Stack.Screen name="CheatSheetChecklist" component={CheatSheetChecklist} />
          <Stack.Screen name="Dev" component={DevScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
