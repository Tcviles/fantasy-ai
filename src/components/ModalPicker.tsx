// components/ModalPicker.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export function ModalPicker({
  value,
  options,
  placeholder = '-',
  onChange,
  title,
}: {
  value?: number | null;
  options: number[];
  placeholder?: string;
  title?: string;
  onChange: (v: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.input} onPress={() => setOpen(true)}>
        <Text style={styles.inputText}>{value ?? placeholder}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            <FlatList
              data={options}
              keyExtractor={(i) => String(i)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.row}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={styles.rowText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancel} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: { padding: 10, borderWidth: 1, borderRadius: 8, borderColor: '#6ee7b7' },
  inputText: { color: '#fff', fontWeight: '700' },
  backdrop: { flex: 1, backgroundColor: '#0008', justifyContent: 'flex-end' },
  sheet: { maxHeight: '60%', backgroundColor: '#111', borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { color: '#6ee7b7', fontWeight: '700', fontSize: 16, padding: 12 },
  row: { padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#333' },
  rowText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancel: { padding: 16, alignItems: 'center' },
  cancelText: { color: '#aaa', fontWeight: '700' },
});
