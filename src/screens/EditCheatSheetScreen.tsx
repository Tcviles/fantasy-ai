import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Alert, TouchableOpacity } from 'react-native';
import { theme } from '../utils/constants';
import SelectPlayerModal from '../components/SelectPlayerModal';
import { getDataFromAsyncStorage, saveDataToAsyncStorage } from '../utils/asyncStorageHelper';
import debounce from 'lodash.debounce';
import { Player } from '../utils/types';
import { PlayerRow } from '../components/CheatSheet/PlayerRow';
import { TierRow } from '../components/CheatSheet/TierRow';
import { autoSaveCheatSheet, createNewTier, getIndexOfRankedPlayer, getPlayerRank, moveItem } from '../utils/cheatSheetHelpers';
import MoveTierModal from '../components/CheatSheet/MoveTeirModal';
import RankModal from '../components/CheatSheet/RankModal';
import { AppContext } from '../context/AppContext';


const EditCheatSheetScreen = ({ route, navigation }: any) => {
  const { cheatSheetId } = route.params || {};
  const [name, setName] = useState('');
  const [players, setPlayers] = useState<any[]>([]);
  const [playerModalVisible, setPlayerModalVisible] = useState(false);
  const [rankModalVisible, setRankModalVisible] = useState(false);
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number | null>(null);
  const [newRank, setNewRank] = useState<number | string>('');
  const [moveTierModalVisible, setMoveTierModalVisible] = useState(false);
  const [selectedTierIndex, setSelectedTierIndex] = useState<number | null>(null);
  const [moveAboveRank, setMoveAboveRank] = useState<string>('');
  const { loadCheatSheets } = useContext(AppContext);
  const [loading, setLoading] = useState(true); // 🔥 added

  const handleAddPlayer = (player: Player) => {
    setPlayers(prev => {
      if (prev.find(p => p.player_id === player.player_id)) {
        console.warn("Player already added:", player.first_name, player.last_name);
        return prev;
      }
      return [...prev, player];
    });
  };

  useEffect(() => {
    const loadData = async () => {
      if (!cheatSheetId) {
        Alert.alert("Error", "Missing cheat sheet ID.");
        navigation.goBack();
        return;
      }

      try {
        const saved = await getDataFromAsyncStorage(`cheatSheet-${cheatSheetId}`);
        if (saved) {
          setName(saved.name || '');
          setPlayers(saved.players || []);
        }
      } catch (e) {
        console.error('[Init Load] Failed to load cheat sheet', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [cheatSheetId]);

  useEffect(() => {
    if (loading) return;
    const debouncedSave = debounce(() => {
      autoSaveCheatSheet(cheatSheetId, name, players).catch(e =>
        console.error('[AutoSave] Failed to save cheat sheet', e)
      );
    }, 1000);

    debouncedSave();
    return () => debouncedSave.cancel();
  }, [players, name, cheatSheetId, loading]);

  const handleInsertTier = () => {
    const newTier = createNewTier(players);
    const existingTiers = players.filter(p => p.type === 'tier');

    if (players.length === 0 || existingTiers.length === 0) {
      setPlayers([newTier, ...players]);
    } else {
      setPlayers([...players, newTier]);
    }
  };

  const handlePlayerRankingUpdate = () => {
    const validRank = Number(newRank);
    const totalPlayers = players.filter(p => p.type !== 'tier').length;

    if (isNaN(validRank) || validRank < 1 || validRank > totalPlayers) {
      Alert.alert('Invalid Rank', `Rank must be between 1 and ${totalPlayers}`);
      return;
    }

    const targetIndex = getIndexOfRankedPlayer(players, validRank);
    setPlayers(prev => moveItem(prev, selectedPlayerIndex!, targetIndex));
    setRankModalVisible(false);
    setNewRank('');
  };

  const openRankModal = (index: number) => {
    setSelectedPlayerIndex(index);
    setNewRank(index + 1);
    setRankModalVisible(true);
  };

  const handleRemovePlayer = (player_id: string | number) => {
    const updatedPlayers = players.filter((player) => player.player_id !== player_id);
    setPlayers(updatedPlayers);
  };

  const handleMoveTier = () => {
    if (selectedTierIndex === null) {
      Alert.alert('Error', 'No tier selected to move.');
      return;
    }

    const rankToMoveAbove = parseInt(moveAboveRank, 10);
    const targetIndex = getIndexOfRankedPlayer(players, rankToMoveAbove);

    const newPlayerList = moveItem(players, selectedTierIndex, targetIndex);
    setPlayers(newPlayerList);
    setMoveTierModalVisible(false);
  };

  const renderPlayer = ({ item, index }: any) => {
    if (item.type === 'tier') {
      return (
        <TierRow
          item={item}
          index={index}
          onMoveTier={(i: any) => {
            setSelectedTierIndex(i);
            setMoveAboveRank('');
            setMoveTierModalVisible(true);
          }}
          onDeleteTier={(id: any) => setPlayers(prev => prev.filter(p => p.id !== id))}
        />
      );
    }

    const rank = getPlayerRank(players, index);
    return (
      <PlayerRow
        item={item}
        rank={rank}
        index={index}
        openRankModal={openRankModal}
        handleRemovePlayer={handleRemovePlayer}
      />
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading cheat sheet...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>Create/Edit Cheat Sheet</Text>
        <TouchableOpacity onPress={handleInsertTier}>
          <Text style={{ color: theme.colors.accent, fontWeight: 'bold' }}>+ Tier</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Cheat Sheet Name"
        value={name}
        onChangeText={setName}
      />
      <FlatList
        data={players}
        keyExtractor={(item, index) => {
          if (item.type === 'tier') return item.id || `tier-${index}`;
          return String(item.player_id);
        }}
        renderItem={({ item, index }) => renderPlayer({ item, index })}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setPlayerModalVisible(true)}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>

      <SelectPlayerModal
        visible={playerModalVisible}
        onClose={() => setPlayerModalVisible(false)}
        onSelectPlayer={handleAddPlayer}
        filterPlayers={players}
      />

      <RankModal
        visible={rankModalVisible}
        onClose={() => setRankModalVisible(false)}
        currentRank={selectedPlayerIndex! + 1}
        newRank={newRank}
        setNewRank={setNewRank}
        onSave={handlePlayerRankingUpdate}
      />

      <MoveTierModal
        visible={moveTierModalVisible}
        moveAboveRank={moveAboveRank}
        setMoveAboveRank={setMoveAboveRank}
        onMove={handleMoveTier}
        onClose={() => setMoveTierModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    color: theme.colors.text,
  },
  list: {
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: theme.colors.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {
    fontSize: 30,
    color: theme.colors.background,
  },

});

export default EditCheatSheetScreen;
