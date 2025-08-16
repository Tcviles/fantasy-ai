import React, { useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../utils/types';
import { theme } from '../utils/constants';
import { AppContext } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

export default function MenuScreen({ navigation }: Props) {

  const { loadPlayers } = useContext(AppContext);

  useEffect(() => {
    loadPlayers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fantasy AI</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Compare')}>
        <Text style={styles.buttonText}>Compare Players</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('KeeperCalc')}>
        <Text style={styles.buttonText}>Keeper Calculator</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CheatSheet')}>
        <Text style={styles.buttonText}>Cheat Sheet Creator</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dev')}>
        <Text style={styles.buttonText}>Dev</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 36,
    color: theme.colors.gold,
    fontFamily: 'BebasNeue_400Regular',
    marginBottom: theme.spacing.lg,
  },
  button: {
    backgroundColor: theme.colors.card,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
});
