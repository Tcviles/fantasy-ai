import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { theme, NFL_TEAMS } from '../utils/constants';
import { ModalPicker } from './ModalPicker';
import { fetchPlayersByPosition } from '../services/api';
import { Player } from '../utils/types';

type Stage = 'position' | 'team' | 'player' | 'details';

type Props = {
  visible: boolean;
  teamsCount: number;                 // for pick options (1..teams)
  onClose: () => void;
  onSave: (data: { player: Player; round: number; pick: number }) => void;
  initial?: {
    player?: Player | null;
    round?: number | null;
    pick?: number | null;
  };
};

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'] as const;
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export default function SelectKeeperModal({
  visible,
  teamsCount,
  onClose,
  onSave,
  initial,
}: Props) {
  const [stage, setStage] = useState<Stage>('position');
  const [pos, setPos] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(initial?.player ?? null);
  const [round, setRound] = useState<number | null>(initial?.round ?? null);
  const [pick, setPick] = useState<number | null>(initial?.pick ?? null);

  const pickOptions = useMemo(() => range(teamsCount), [teamsCount]);
  const roundOptions = useMemo(() => range(18), []);

  useEffect(() => {
    if (visible) {
      // reset flow every time it opens
      setStage('position');
      setPos(null);
      setTeam(null);
      setPlayers([]);
      setLoading(false);
      setError(null);

      setSelectedPlayer(initial?.player ?? null);
      setRound(initial?.round ?? null);
      setPick(initial?.pick ?? null);
    }
  }, [visible, initial]);

  const loadPlayers = async (p: string, t?: string) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetchPlayersByPosition(p, t);
      const data: Player[] = Array.isArray(resp) ? resp : resp?.players ?? [];
      setPlayers(data);
    } catch (e) {
      setError('Failed to load players. Try again.');
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  const choosePosition = (p: string) => {
    setPos(p);
    setStage('team');
  };

  const chooseTeam = async (t: string) => {
    setTeam(t);
    setStage('player');
    await loadPlayers(pos!, t);
  };

  const choosePlayer = (pl: Player) => {
    setSelectedPlayer({ ...pl, player_id: String(pl.player_id) });
    setStage('details');
  };

  const canSave = !!(selectedPlayer && round && pick);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {stage === 'position' && 'Select Position'}
            {stage === 'team' && `Select Team — ${pos}`}
            {stage === 'player' && `${pos} Players on ${team}`}
            {stage === 'details' && 'Keeper Details'}
          </Text>

          {stage === 'position' && (
            <FlatList
              data={POSITIONS as unknown as string[]}
              keyExtractor={(i) => i}
              numColumns={2}
              columnWrapperStyle={styles.rowWrap}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => choosePosition(item)} style={styles.tile}>
                  <Text style={styles.tileText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {stage === 'team' && (
            <FlatList
              data={NFL_TEAMS}
              keyExtractor={(i) => i}
              numColumns={3}
              columnWrapperStyle={styles.rowWrap}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => chooseTeam(item)} style={styles.tile}>
                  <Text style={styles.tileText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {stage === 'player' && (
            <>
              {loading && <ActivityIndicator size="large" color={theme.colors.accent} style={{ marginTop: 8 }} />}
              {!loading && error && (
                <Text style={{ color: theme.colors.danger, textAlign: 'center', marginTop: 8 }}>{error}</Text>
              )}
              {!loading && !error && (
                <FlatList
                  data={players}
                  keyExtractor={(it) => String(it.player_id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => choosePlayer(item)} style={styles.listRow}>
                      <Text style={styles.listText}>
                        {item.first_name} {item.last_name}{item.team ? ` (${item.team})` : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </>
          )}

          {stage === 'details' && (
            <View style={{ gap: 10 }}>
              <Text style={styles.subTitle}>
                {selectedPlayer
                  ? `${selectedPlayer.first_name} ${selectedPlayer.last_name}${selectedPlayer.team ? ` (${selectedPlayer.team})` : ''}`
                  : 'No player selected'}
              </Text>
              <View style={styles.controlsRow}>
                <View style={styles.control}>
                  <Text style={styles.controlLabel}>Round</Text>
                  <ModalPicker
                    title="Select Round"
                    value={round ?? null}
                    options={roundOptions}
                    onChange={setRound}
                  />
                </View>
                <View style={styles.control}>
                  <Text style={styles.controlLabel}>Pick</Text>
                  <ModalPicker
                    title="Select Pick"
                    value={pick ?? null}
                    options={pickOptions}
                    onChange={setPick}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={() => {
                if (stage === 'details') return setStage('player');
                if (stage === 'player') return setStage('team');
                if (stage === 'team') return setStage('position');
                onClose();
              }}
              style={[styles.footerBtn, styles.backBtn]}
            >
              <Text style={styles.backText}>{stage === 'position' ? 'Close' : 'Back'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!canSave || !selectedPlayer || !round || !pick) return;
                onSave({ player: selectedPlayer, round, pick });
              }}
              style={[styles.footerBtn, styles.saveBtn, !canSave && { opacity: 0.5 }]}
              disabled={!canSave}
            >
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0009', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.colors.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16, maxHeight: '88%' },
  title: { fontSize: 20, fontWeight: '800', color: theme.colors.gold, textAlign: 'center', marginBottom: 8 },
  subTitle: { color: theme.colors.text, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  rowWrap: { justifyContent: 'space-between', marginBottom: theme.spacing.sm },
  tile: { flex: 1, backgroundColor: theme.colors.card, margin: 5, paddingVertical: 18, borderRadius: theme.radius.md, alignItems: 'center', borderWidth: 2, borderColor: theme.colors.accent },
  tileText: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  listRow: { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#333' },
  listText: { color: theme.colors.text, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  controlsRow: { flexDirection: 'row', gap: 12, marginTop: 6 },
  control: { flex: 1 },
  controlLabel: { color: theme.colors.text, marginBottom: 6, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 12, marginTop: 12 },
  footerBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  backBtn: { backgroundColor: '#333' },
  saveBtn: { backgroundColor: theme.colors.accent },
  backText: { color: theme.colors.text, fontWeight: '700' },
  saveText: { color: '#000', fontWeight: '800' },
});
