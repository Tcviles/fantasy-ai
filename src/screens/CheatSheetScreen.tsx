import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../utils/constants';
import { RootStackParamList } from '../utils/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'CheatSheet'>;

const CheatSheetScreen = ({ navigation }: Props) => {
  const [cheatSheets, setCheatSheets] = useState<any[]>([]);

  useEffect(() => {
    const loadCheatSheets = async () => {
      console.log("[CheatSheetScreen] Loading cheat sheets from AsyncStorage...");
      try {
        const savedCheatSheets = await AsyncStorage.getItem('cheatSheets');
        console.log("[CheatSheetScreen] Loaded cheat sheets:", savedCheatSheets);
        if (savedCheatSheets) {
          const parsedCheatSheets = JSON.parse(savedCheatSheets);
          console.log("[CheatSheetScreen] Parsed cheat sheets:", parsedCheatSheets);
          setCheatSheets(parsedCheatSheets);
        }
      } catch (error) {
        console.error("[CheatSheetScreen] Failed to load cheat sheets:", error);
        Alert.alert('Error', 'Failed to load cheat sheets.');
      }
    };

    loadCheatSheets();
  }, []);

  const navigateToCheatSheet = (cheatSheet: any) => {
    console.log("[CheatSheetScreen] Navigating to CheatSheetChecklist with:", cheatSheet);
    navigation.navigate('CheatSheetChecklist', { cheatSheet });
  };

  const handleAddNew = () => {
    console.log("[CheatSheetScreen] Add New Cheat Sheet button clicked.");
    navigation.navigate('EditCheatSheet');
  };

  const renderCheatSheet = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigateToCheatSheet(item)}
      style={styles.cheatSheetItem}
    >
      <Text style={styles.cheatSheetText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cheat Sheet Creator</Text>
      <FlatList
        data={cheatSheets}
        keyExtractor={(item) => item.name}
        renderItem={renderCheatSheet}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
        <Text style={styles.addButtonText}>Add New Cheat Sheet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    marginBottom: 20,
  },
  cheatSheetItem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  cheatSheetText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
});

export default CheatSheetScreen;
