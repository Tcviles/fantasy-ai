import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../utils/constants';
import { CheatSheet, Player, RootStackParamList } from '../utils/types';
import { AppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { saveDataToAsyncStorage } from '../utils/asyncStorageHelper';
import { createBlankCheatSheet } from '../utils/cheatSheetHelpers';
import fantasypros_ecr from '../utils/cheatSheets/fantasypros_ecr.json';
import uuid from 'react-native-uuid';


type Props = NativeStackScreenProps<RootStackParamList, 'CheatSheet'>;

const CheatSheetScreen = ({ navigation }: Props) => {
  const {
    state: { cheatSheets, players: allPlayers },
    loadCheatSheets,
    deleteCheatSheet,
  } = useContext(AppContext);

  useFocusEffect(
    React.useCallback(() => {
      loadCheatSheets();
      console.log("[CheatSheetScreen] refreshed");
    }, [])
  );

  const handleCreate = () => {
    console.log("hit create")
    const newSheet = createBlankCheatSheet();
    console.log("[CheatSheetScreen::handleCreate] newSheet: ", newSheet)
    saveDataToAsyncStorage(`cheatSheet-${newSheet.id}`, newSheet);
    saveDataToAsyncStorage('cheatSheets', [...cheatSheets, newSheet]);
    loadCheatSheets();
    navigation.navigate('EditCheatSheet', { cheatSheetId: newSheet.id });
  };

  const handleImportFantasyPros = () => {
    const sheetId = uuid.v4();

    const players = fantasypros_ecr.map((fpPlayer): Player => {
      const matchedPlayer = allPlayers.find(
        (ap: Player) =>
          ap.first_name === fpPlayer.first_name &&
          ap.last_name === fpPlayer.last_name &&
          ap.team === fpPlayer.team &&
          ap.position === fpPlayer.position
      );

      return {
        ...fpPlayer,
        player_id: matchedPlayer?.player_id || uuid.v4(),
      };
    });

    const newSheet: CheatSheet = {
      id: sheetId,
      name: 'FantasyPros 2025 Overall',
      players,
      modified: new Date().toISOString(),
    };

    saveDataToAsyncStorage(`cheatSheet-${sheetId}`, newSheet);
    saveDataToAsyncStorage('cheatSheets', [...cheatSheets, newSheet]);
    loadCheatSheets();
    navigation.navigate('EditCheatSheet', { cheatSheetId: sheetId });
  };

  const handleEdit = (cheatSheet: any) => {
    console.log("[CheatSheetScreen] handleEdit: ", cheatSheet)
    navigation.navigate('EditCheatSheet', { cheatSheetId: cheatSheet.id });
  };

  const handleDraft = (sheet: CheatSheet) => {
    navigation.navigate('DraftChecklistView', { sheet });
  };

  const handleDelete = (name: string) => {
    deleteCheatSheet(name)
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() =>
        Alert.alert(
          'Cheat Sheet Options',
          `${item.name}`,
          [
            { text: 'Edit', onPress: () => handleEdit(item) },
            { text: 'Draft', onPress: () => handleDraft(item) },
            { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.name) },
            { text: 'Cancel', style: 'cancel' },
          ]
        )
      }
      style={styles.row}
    >
      <Text style={styles.cellText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cheat Sheet Creator</Text>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          console.log("wat")
          handleCreate()
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
      {!cheatSheets.some((sheet: CheatSheet) => sheet.name === 'FantasyPros 2025 Overall') && (
        <TouchableOpacity style={styles.createButton} onPress={handleImportFantasyPros}>
          <Text style={styles.createButtonText}>Import FantasyPros 2025</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={cheatSheets}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.gold,
    marginBottom: 16,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  list: {
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },

  cellLarge: {
    flex: 2,
    paddingRight: 8,
  },
  cell: {
    flex: 1.5,
    paddingRight: 8,
  },
  cellSmall: {
    flex: 1,
  },
  cellText: {
    fontSize: 16,
    color: theme.colors.text,
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    flex: 2,
  },

  edit: {
    color: theme.colors.accent,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },

  delete: {
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: theme.colors.text,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: theme.colors.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    zIndex: 10
  },
  fabText: {
    fontSize: 30,
    color: theme.colors.background,
  },
});

export default CheatSheetScreen;
