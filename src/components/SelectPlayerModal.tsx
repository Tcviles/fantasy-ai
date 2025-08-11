import React, { useEffect, useState } from 'react';
import { Modal, View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { NFL_TEAMS, POSITIONS, theme } from '../utils/constants';
import { fetchPlayersByPosition } from '../services/api';
import { Player } from '../utils/types';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  filterPlayers?: any[];  // New prop to filter players (optional)
};

type Stage = 'positions' | 'teams' | 'players';

export default function SelectPlayerModal({
  visible, onClose, onSelectPlayer, filterPlayers = []
}: Props) {
  const [stage, setStage] = useState<Stage>('positions');
  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setStage('positions');
      setSelectedPos(null);
      setSelectedTeam(null);
      setPlayers([]);
      setLoading(false);
      setError(null);
    }
  }, [visible]);

  const onChoosePosition = (pos: string) => {
    setSelectedPos(pos);
    setStage('teams');
  };

  const onChooseTeam = async (team: string) => {
    setSelectedTeam(team);
    setStage('players');
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchPlayersByPosition(selectedPos!, team);
      const data: Player[] = Array.isArray(resp) ? resp : (resp?.players ?? []);
      
      // Filter out already selected players if filterPlayers is provided
      setPlayers(data.filter(player => !filterPlayers.some(selected => selected.player_id === player.player_id))); 
    } catch (e) {
      setError('Failed to load players. Try again.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          {stage === 'positions' && 'Select Position'}
          {stage === 'teams' && `Select Team — ${selectedPos}`}
          {stage === 'players' && `${selectedPos} Players on ${selectedTeam}`}
        </Text>

        {stage === 'positions' && (
          <FlatList
            data={POSITIONS}
            keyExtractor={(item) => item}
            numColumns={2}
            columnWrapperStyle={styles.rowWrap}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onChoosePosition(item)} style={styles.tile}>
                <Text style={styles.tileText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {stage === 'teams' && (
          <FlatList
            data={NFL_TEAMS}
            keyExtractor={(item) => item}
            numColumns={3}
            columnWrapperStyle={styles.rowWrap}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onChooseTeam(item)} style={styles.tile}>
                <Text style={styles.tileText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {stage === 'players' && (
          <>
            {loading && <ActivityIndicator size="large" color={theme.colors.accent} style={{ marginTop: 16 }} />}
            {!loading && error && <Text style={{ color: theme.colors.danger, textAlign: 'center' }}>{error}</Text>}
            {!loading && !error && (
              <FlatList
                data={players}
                keyExtractor={(item) => String(item.player_id)}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => onSelectPlayer(item)} style={styles.listRow}>
                    <Text style={styles.listRowText}>
                      {item.first_name} {item.last_name}{item.team ? ` (${item.team})` : ''}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </>
        )}

        <View style={styles.footerRow}>
          {stage !== 'positions' && (
            <TouchableOpacity
              onPress={() => {
                if (stage === 'players') { setStage('teams'); }
                else if (stage === 'teams') { setStage('positions'); }
              }}
              style={styles.backBtn}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}
          <Button title="Cancel" color={theme.colors.danger} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 20, backgroundColor: theme.colors.background },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: theme.colors.gold },
  rowWrap: { justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  tile: {
    flex: 1, backgroundColor: theme.colors.card, margin: 5, paddingVertical: 18,
    borderRadius: theme.radius.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: theme.colors.accent,
  },
  tileText: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  listRow: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#333' },
  listRowText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  footerRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 10 },
  backText: { color: theme.colors.accent, fontWeight: '700' },
});
