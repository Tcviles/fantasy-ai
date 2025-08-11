import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import { theme } from '../utils/constants';
import SelectPlayerModal from '../components/SelectPlayerModal';
import { getDataFromAsyncStorage, saveDataToAsyncStorage } from '../utils/asyncStorageHelper';

const EditCheatSheetScreen = ({ route, navigation }: any) => {
  const { cheatSheet } = route.params || {};
  const [name, setName] = useState(cheatSheet?.name || '');
  const [players, setPlayers] = useState<any[]>(cheatSheet?.players || []);
  const [modalVisible, setModalVisible] = useState(false);
  const [rankModalVisible, setRankModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [newRank, setNewRank] = useState<number | string>('');

  const handleAddPlayer = (player: any) => {
    if (players.length < 300) {
      setPlayers((prev) => [...prev, player]);
      setModalVisible(false);
    } else {
      Alert.alert('Limit Reached', 'You can add up to 300 players to the cheat sheet.');
    }
  };

  const handlePlayerRankingUpdate = () => {
    const validRank = Number(newRank);
    if (isNaN(validRank) || validRank < 1 || validRank > players.length) {
      Alert.alert('Invalid Rank', 'Rank must be between 1 and the total number of players.');
      return;
    }

    const updatedPlayers = [...players];
    const playerToMove = updatedPlayers[selectedPlayerIndex!];
    updatedPlayers.splice(selectedPlayerIndex!, 1);
    updatedPlayers.splice(validRank - 1, 0, playerToMove);

    setPlayers(updatedPlayers);
    setRankModalVisible(false);
    setNewRank('');
  };

  const openRankModal = (index: number) => {
    setSelectedPlayerIndex(index);
    setNewRank(index + 1);
    setRankModalVisible(true);
  };

  const handleRemovePlayer = (player_id: string | number) => {
    const updatedPlayers = players.filter((player) => player.player_id !== player_id);
    setPlayers(updatedPlayers);
  };

  const handleSave = async () => {
    if (name.trim() === '') {
      Alert.alert('Error', 'Please provide a name for the cheat sheet.');
      return;
    }
    const newCheatSheet = { name, players };
    try {
      let existingCheatSheets = await getDataFromAsyncStorage('cheatSheets');
      const index = existingCheatSheets.findIndex((sheet: any) => sheet.name === cheatSheet.name);
      if (index !== -1) {
        existingCheatSheets[index] = { name, players };
      } else {
        existingCheatSheets.push(newCheatSheet);
      }
      await saveDataToAsyncStorage('cheatSheets', existingCheatSheets);
      navigation.navigate('CheatSheet');
    } catch (error) {
      Alert.alert('Error', 'Failed to save the cheat sheet.');
    }
  };

  const renderPlayer = ({ item, index }: any) => (
    <View style={styles.playerItem}>
      <View style={styles.playerRow}>
        <Text style={styles.playerText}>
          {`${index + 1}. ${item.first_name} ${item.last_name}`}
        </Text>
          <TouchableOpacity onPress={() => openRankModal(index)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Rank</Text>
          </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create/Edit Cheat Sheet</Text>
      <TextInput
        style={styles.input}
        placeholder="Cheat Sheet Name"
        value={name}
        onChangeText={setName}
      />
      <FlatList
        data={players}
        keyExtractor={(item) => String(item.player_id)}
        renderItem={renderPlayer}
        contentContainerStyle={styles.list}
      />
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Player</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <SelectPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectPlayer={handleAddPlayer}
        filterPlayers={players}
      />

      <Modal
        visible={rankModalVisible}
        onRequestClose={() => setRankModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Player Rank</Text>
          <Text style={styles.modalText}>Current Rank: {selectedPlayerIndex! + 1}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter New Rank"
            value={newRank?.toString()}
            onChangeText={(text) => setNewRank(Number(text))}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handlePlayerRankingUpdate}
            >
              <Text style={styles.modalButtonText}>Save Rank</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  list: {
    marginBottom: 20,
  },
  playerItem: {
    padding: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  editButton: {
    backgroundColor: theme.colors.background,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  editButtonText: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.gold,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '10%',
  },
  modalButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditCheatSheetScreen;
