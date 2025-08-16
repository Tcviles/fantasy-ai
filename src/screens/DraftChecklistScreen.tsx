import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../utils/constants';
import { getDataFromAsyncStorage } from '../utils/asyncStorageHelper';
import { CheatSheet, RootStackParamList } from '../utils/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'DraftChecklist'>;

export default function DraftChecklistScreen({ navigation }: Props) {
  const [cheatSheets, setCheatSheets] = useState<CheatSheet[]>([]);

  useEffect(() => {
    const loadCheatSheets = async () => {
      const sheets = await getDataFromAsyncStorage('cheatSheets');
      setCheatSheets(sheets || []);
    };

    const unsubscribe = navigation.addListener('focus', loadCheatSheets);
    return unsubscribe;
  }, [navigation]);

  const handleSelectSheet = (sheet: CheatSheet) => {
    navigation.navigate('DraftChecklistView', { sheet });
  };

  const handleGoToCheatSheet = () => {
    navigation.navigate('CheatSheet');
  };

  const renderItem = ({ item }: { item: CheatSheet }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleSelectSheet(item)}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.subText}>{item.players.length} players</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Cheat Sheet</Text>

      {cheatSheets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Must add a cheat sheet first.</Text>
          <TouchableOpacity style={styles.button} onPress={handleGoToCheatSheet}>
            <Text style={styles.buttonText}>Add a Cheat Sheet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cheatSheets}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.gold,
    marginBottom: 20,
  },
  itemContainer: {
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subText: {
    fontSize: 14,
    color: theme.colors.accent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.background,
    fontWeight: 'bold',
  },
});
