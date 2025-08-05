import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Button,
} from 'react-native';
import { POSITIONS, theme } from '../utils/constants';

type Props = {
  visible: boolean;
  position: string | null;
  players: any[];
  onClose: () => void;
  onSelectPosition: (position: string) => void;
  onSelectPlayer: (player: any) => void;
};

export default function PlayerPickerModal({
  visible,
  position,
  players,
  onClose,
  onSelectPosition,
  onSelectPlayer,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>
          {position ? `Choose a ${position}` : 'Choose Position'}
        </Text>

        <FlatList
          data={position ? players : POSITIONS}
          keyExtractor={(item) => (position ? item.player_id : item)}
          renderItem={({ item }) => {
            const label = position
              ? `${item.search_full_name} (${item.team})`
              : item;

            return (
              <TouchableOpacity
                onPress={() =>
                  position
                    ? onSelectPlayer(item)
                    : onSelectPosition(item)
                }
                style={styles.listItem}
              >
                <Text style={styles.listText}>{label}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.buttonContainer}>
          <Button title="Cancel" onPress={onClose} color={theme.colors.danger} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontFamily: 'BebasNeue_400Regular',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  listItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  listText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
  },
});
