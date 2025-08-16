import React from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../../utils/constants';

export const TierRow = ({ item, index, onMoveTier, onDeleteTier }: any) => (
  <TouchableOpacity
    onLongPress={() =>
      Alert.alert(
        'Tier Options',
        `${item.title}`,
        [
          { text: 'Move Tier', onPress: () => onMoveTier(index) },
          { text: 'Delete', style: 'destructive', onPress: () => onDeleteTier(item.id) },
          { text: 'Cancel', style: 'cancel' },
        ]
      )
    }
    style={styles.tierRow}
  >
    <Text style={styles.tierText}>{item.title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  tierRow: {
    paddingVertical: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 8,
    marginVertical: 5,
  },
  tierText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.background,
    textAlign: 'center',
  },
});
