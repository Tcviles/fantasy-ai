import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { theme } from '../utils/constants';
import SelectPlayerModal from '../components/SelectPlayerModal';
import { getDataFromAsyncStorage } from '../utils/asyncStorageHelper';
import debounce from 'lodash.debounce';
import { Player } from '../utils/types';
import { PlayerRow } from '../components/CheatSheet/PlayerRow';
import { TierRow } from '../components/CheatSheet/TierRow';
import { autoSaveCheatSheet, createNewTier, getPlayerRank, moveTierToRank, removePlayer, updatePlayerRank } from '../utils/cheatSheetHelpers';
import MoveTierModal from '../components/CheatSheet/MoveTeirModal';
import RankModal from '../components/CheatSheet/RankModal';
import { CheatSheetHeader } from '../components/CheatSheet/CheatSheetHeader';

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
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<any>>(null);
  const [pendingScrollToEnd, setPendingScrollToEnd] = useState(false);


  const handleAddPlayer = (player: Player) => {
    setPlayers(prev => {
      if (prev.find(p => p.player_id === player.player_id)) {
        console.warn("Player already added:", player.first_name, player.last_name);
        return prev;
      }
      setPendingScrollToEnd(true);
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
    setPlayers(prev => updatePlayerRank(prev, selectedPlayerIndex!, validRank));
    setRankModalVisible(false);
    setNewRank('');
  };

  const openRankModal = (index: number) => {
    setSelectedPlayerIndex(index);
    const actualRank = getPlayerRank(players, index);
    setNewRank(actualRank);
    setRankModalVisible(true);
  };

  const handleRemovePlayer = (player_id: string | number) => {
    setPlayers(prev => removePlayer(prev, player_id));
    setSelectedPlayerIndex(null);
  };


  const handleMoveTier = () => {
    if (selectedTierIndex === null) {
      Alert.alert('Error', 'No tier selected to move.');
      return;
    }

    const rankToMoveAbove = parseInt(moveAboveRank, 10);
    setPlayers(prev => moveTierToRank(prev, selectedTierIndex, rankToMoveAbove));
    setMoveTierModalVisible(false);
  };

  const renderPlayer = ({ item, index }: any) => {
    if (!item) return null;

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
      <CheatSheetHeader name={name} setName={setName} handleInsertTier={handleInsertTier}/>
      <FlatList
        ref={listRef}
        data={players}
        keyExtractor={(item, index) => {
          if (item.type === 'tier') return item.id || `tier-${index}`;
          return String(item.player_id);
        }}
        renderItem={({ item, index }) => renderPlayer({ item, index })}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => {
          if (pendingScrollToEnd) {
            listRef.current?.scrollToEnd({ animated: true });
            setPendingScrollToEnd(false);
          }
        }}
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
        currentRank={selectedPlayerIndex !== null ? getPlayerRank(players, selectedPlayerIndex) : 1}
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
