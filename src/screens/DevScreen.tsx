import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { startSync } from '../services/api';
import { theme } from '../utils/constants';

export default function DevScreen() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const checkPassword = () => {
    if (password === '092618') {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <View style={styles.container}>
      {!authenticated && (
        <Modal visible animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Dev Password</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={theme.colors.mutedText}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={checkPassword}>
                <Text style={styles.buttonText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {authenticated && (
        <>
          <Text style={styles.title}>Welcome to Dev Tools</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              try {
                console.log('[DevScreen] Starting sync...');
                const result = await startSync();
                alert(`Sync triggered: ${JSON.stringify(result)}`);
              } catch (err) {
                alert('Failed to start sync. Check logs.');
              }
            }}
          >
            <Text style={styles.buttonText}>Start Player Sync</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontFamily: 'BebasNeue_400Regular',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'BebasNeue_400Regular',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.accent,
    color: theme.colors.text,
    fontSize: 16,
    marginBottom: theme.spacing.md,
    paddingVertical: 6,
  },
  button: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: '#000', // dark text for contrast
    fontSize: 16,
    fontWeight: '700',
  },
});
