// components/MoveTierModal.tsx
import React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { theme } from '../../utils/constants';

type MoveTierModalProps = {
  visible: boolean;
  moveAboveRank: string;
  setMoveAboveRank: (val: string) => void;
  onMove: () => void;
  onClose: () => void;
};

const MoveTierModal: React.FC<MoveTierModalProps> = ({
  visible,
  moveAboveRank,
  setMoveAboveRank,
  onMove,
  onClose,
}) => (
  <Modal visible={visible} onRequestClose={onClose} animationType="slide">
    <View style={styles.container}>
      <Text style={styles.title}>Move Tier</Text>
      <Text style={styles.text}>Enter the rank number to move this tier above:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter Rank Number (e.g. 14)"
        value={moveAboveRank}
        onChangeText={setMoveAboveRank}
      />
      <TouchableOpacity style={styles.button} onPress={onMove}>
        <Text style={styles.buttonText}>Move</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.colors.background },
  title: { fontSize: 20, fontWeight: 'bold', color: theme.colors.gold, marginBottom: 20 },
  text: { fontSize: 16, color: theme.colors.text, marginBottom: 20 },
  input: { padding: 10, borderWidth: 1, borderColor: theme.colors.accent, borderRadius: 8, fontSize: 16 },
  button: {
    marginTop: 20,
    backgroundColor: theme.colors.accent,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: theme.colors.background, fontSize: 16, fontWeight: '600' },
});

export default MoveTierModal;
