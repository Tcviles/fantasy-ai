import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../utils/constants';

export const PlayerRow = ({ item, rank, index, openRankModal, handleRemovePlayer }: any) => (
  <View style={styles.playerItem}>
    <View style={styles.playerRow}>
      <Text style={styles.playerText}>
        {rank}. {item.first_name} {item.last_name} ({item.team} - {item.position})
      </Text>
      <TouchableOpacity style={styles.editButton} onPress={() => openRankModal(index)}>
        <Text style={styles.editButtonText}>Edit Rank</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={() => handleRemovePlayer(item.player_id)}>
        <Text style={styles.editButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
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
    flexWrap: 'wrap',
  },
  playerText: {
    color: theme.colors.text,
    fontSize: 16,
    flex: 1,
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
});
