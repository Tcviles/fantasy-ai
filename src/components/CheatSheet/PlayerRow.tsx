import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../../utils/constants';

export const PlayerRow = ({ item, rank, index, openRankModal, handleRemovePlayer }: any) => (
  <TouchableOpacity
      onLongPress={() =>
        Alert.alert(
          'Player Options',
          `${rank}. ${item.first_name} ${item.last_name} (${item.team} - ${item.position})`,
          [
            { text: 'Update Rank', onPress: () => openRankModal(index) },
            { text: 'Delete', style: 'destructive', onPress: () => handleRemovePlayer(item.player_id) },
            { text: 'Cancel', style: 'cancel' },
          ]
        )
      }
      style={styles.playerItem}
    >
      <Text style={styles.playerText}>{rank}. {item.first_name} {item.last_name} ({item.team} - {item.position})</Text>
    </TouchableOpacity>
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
  playerText: {
    color: theme.colors.text,
    fontSize: 16,
    flex: 1,
  }
});
