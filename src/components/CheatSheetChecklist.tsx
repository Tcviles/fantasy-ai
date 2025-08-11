import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../utils/constants';

const CheatSheetChecklist = ({ route, onClose, navigation }: any) => {
  const { cheatSheet } = route.params || {};

  console.log("[CheatSheetChecklist] CheatSheet received:", cheatSheet);

  if (!cheatSheet) {
    console.log("[CheatSheetChecklist] No CheatSheet found.");
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No CheatSheet Found</Text>
      </View>
    );
  }

  const [players, setPlayers] = useState<any[]>(cheatSheet?.players || []);
  const [hideUnavailable, setHideUnavailable] = useState(false);

  console.log("[CheatSheetChecklist] Players loaded:", players);

  const handlePlayerSelect = (player_id: string | number) => {
    console.log("[CheatSheetChecklist] Toggling selection for player:", player_id);
    const updatedPlayers = players.map((player) =>
      player.player_id === player_id
        ? { ...player, is_selected: !player.is_selected }
        : player
    );
    setPlayers(updatedPlayers);
  };

  const filteredPlayers = hideUnavailable
    ? players.filter((player) => !player.is_selected)
    : players;

  console.log("[CheatSheetChecklist] Filtered players list:", filteredPlayers);

  const renderPlayer = ({ item, index }: any) => (
    <View style={styles.playerItem}>
      <View style={styles.playerRow}>
        <Text style={styles.playerText}>
          {`${index + 1}. ${item.first_name} ${item.last_name} ${item.team} (${item.position})`}
        </Text>
        <View style={styles.playerActions}>
          <TouchableOpacity
            onPress={() => handlePlayerSelect(item.player_id)}
            style={[
              styles.selectButton,
              item.is_selected ? styles.selectedButton : styles.unselectedButton,
            ]}
          >
            <Text
              style={[
                styles.selectButtonText,
                item.is_selected && styles.selectedButtonText,
              ]}
            >
              {item.is_selected ? 'Selected' : 'Select'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cheatSheet.name}</Text>

      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText}>Hide Unavailable Players</Text>
        <TouchableOpacity onPress={() => setHideUnavailable(!hideUnavailable)}>
          <Text style={styles.toggleText}>{hideUnavailable ? 'Show' : 'Hide'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPlayers}
        keyExtractor={(item, index) => String(index)}
        renderItem={renderPlayer}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditCheatSheet', { cheatSheet })}
        >
          <Text style={styles.editButtonText}>Edit Rankings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => navigation.navigate('CheatSheet')}
        >
          <Text style={styles.saveButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
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
  playerItem: {
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    marginBottom: 10,
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
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectButton: {
    marginLeft: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedButton: {
    backgroundColor: theme.colors.accent,
  },
  selectedButton: {
    backgroundColor: theme.colors.background,  // No background for selected
    borderWidth: 2,
    borderColor: theme.colors.success,  // Green border for selected
  },
  selectButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  selectedButtonText: {
    color: theme.colors.success,  // Green text for selected button
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    color: theme.colors.text,
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  editButtonText: {
    color: theme.colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,  // Primary color for save button
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
});

export default CheatSheetChecklist;
