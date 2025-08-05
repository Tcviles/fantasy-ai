import React from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
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

export default function SelectPlayerModal({
  visible,
  position,
  players,
  onClose,
  onSelectPosition,
  onSelectPlayer,
}: Props) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {position ? `Players for ${position}` : 'Select Position'}
        </Text>

        <FlatList
          key={position ? 'players' : 'positions'} // 👈 forces remount
          data={position ? players : POSITIONS}
          keyExtractor={(item) => (position ? item.player_id : item)}
          numColumns={position ? 1 : 2}
          columnWrapperStyle={!position ? styles.positionRow : undefined}
          renderItem={({ item }) =>
            position ? (
              <TouchableOpacity
                onPress={() => onSelectPlayer(item)}
                style={styles.modalItem}
              >
                <Text style={styles.modalText}>
                  {item.first_name} {item.last_name} ({item.team})
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onSelectPosition(item)}
                style={styles.positionTile}
              >
                <Text style={styles.positionText}>{item}</Text>
              </TouchableOpacity>
            )
          }
        />

        <View style={styles.modalButton}>
          <Button title="Cancel" color={theme.colors.danger} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.gold,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: theme.colors.text,
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  modalButton: {
    marginTop: 20,
  },
  positionRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  positionTile: {
    flex: 1,
    backgroundColor: theme.colors.card,
    marginHorizontal: 5,
    paddingVertical: 24,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  positionText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
