import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { theme } from '../utils/constants';
import { RootStackParamList } from '../utils/types';
import { AppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { saveDataToAsyncStorage } from '../utils/asyncStorageHelper';
import { createBlankCheatSheet } from '../utils/cheatSheetHelpers';

type Props = NativeStackScreenProps<RootStackParamList, 'CheatSheet'>;

const CheatSheetScreen = ({ navigation }: Props) => {
  const {
    state: { cheatSheets },
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
    const newSheet = createBlankCheatSheet();
    saveDataToAsyncStorage(`cheatSheet-${newSheet.id}`, newSheet);
    saveDataToAsyncStorage('cheatSheets', [...cheatSheets, newSheet]);
    loadCheatSheets();
    navigation.navigate('EditCheatSheet', { cheatSheetId: newSheet.id });
  };


  const handleEdit = (cheatSheet: any) => {
    console.log("[CheatSheetScreen] handleEdit: ", cheatSheet)
    navigation.navigate('EditCheatSheet', { cheatSheetId: cheatSheet.id });
  };

  const handleDelete = (name: string) => {
    Alert.alert('Delete Cheat Sheet', `Delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteCheatSheet(name),
      },
    ]);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <View style={styles.cellLarge}>
        <Text style={styles.cellText}>{item.name}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>{item.modified || '—'}</Text>
      </View>
      <View style={styles.cellSmall}>
        <Text style={styles.cellText}>{item.notes?.length || 0}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Text style={styles.edit}>View/Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.name)}>
          <Text style={styles.delete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cheat Sheet Creator</Text>
      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create Cheat Sheet</Text>
      </TouchableOpacity>

      <FlatList
        data={cheatSheets}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        ListHeaderComponent={
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Cheat Sheet</Text>
            <Text style={styles.headerCell}>Last Modified</Text>
            <Text style={styles.headerCell}>Notes</Text>
            <Text style={styles.headerCell}>Actions</Text>
          </View>
        }
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
});

export default CheatSheetScreen;
