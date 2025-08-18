import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../utils/constants';

export const CheatSheetHeader = ({ name, setName, handleInsertTier }: any) => (
  <>
    <View style={styles.header}>
      <Text style={styles.title}>Create/Edit Cheat Sheet</Text>
      <TouchableOpacity onPress={handleInsertTier}>
        <Text style={styles.tierButton}>+ Tier</Text>
      </TouchableOpacity>
    </View>
    <TextInput
      style={styles.input}
      placeholder="Cheat Sheet Name"
      value={name}
      onChangeText={setName}
    />
  </>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.gold, textAlign: 'center', marginBottom: 20 },
  tierButton: { color: theme.colors.accent, fontWeight: 'bold' },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    color: theme.colors.text,
  }
});
