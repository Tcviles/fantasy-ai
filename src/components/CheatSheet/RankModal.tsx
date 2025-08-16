// components/RankModal.tsx
import React from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { theme } from '../../utils/constants';

type RankModalProps = {
  visible: boolean;
  onClose: () => void;
  currentRank: number;
  newRank: string | number;
  setNewRank: (val: string | number) => void;
  onSave: () => void;
};

const RankModal: React.FC<RankModalProps> = ({
  visible,
  onClose,
  currentRank,
  newRank,
  setNewRank,
  onSave,
}) => (
  <Modal visible={visible} onRequestClose={onClose} animationType="slide">
    <View style={styles.container}>
      <Text style={styles.title}>Edit Player Rank</Text>
      <Text style={styles.text}>Current Rank: {currentRank}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter New Rank"
        value={newRank.toString()}
        onChangeText={(text) => setNewRank(Number(text))}
      />
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={styles.buttonText}>Save Rank</Text>
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

export default RankModal;
