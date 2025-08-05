import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../utils/constants';

type Props = {
  index: number;
  player: any;
  onPress: (index: number) => void;
};

export default function PlayerSlot({ index, player, onPress }: Props) {
  const label = player?.search_full_name
    ? `${player.search_full_name} (${player.position} - ${player.team})`
    : `Select Player ${index + 1}`;

  return (
    <TouchableOpacity onPress={() => onPress(index)} style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: 16,
    marginBottom: 12,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
