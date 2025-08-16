import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { theme } from '../utils/constants';
import LeagueSettingsModal, { LeagueFormat } from '../components/LeagueSettingsModal';
import SelectKeeperModal from '../components/SelectKeeperModal';
import { Player } from '../utils/types';
import { getKeeperRecommendations } from '../services/api'; // 👈 NEW

type KeeperSlot = {
  player: Player | null;
  round: number | null;
  pick: number | null;
};

const MAX_SLOTS = 12;
const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const computeOverall = (teams: number, round: number | null, pick: number | null) => {
  if (!round || !pick) return null;
  return (round - 1) * teams + pick;
};

export default function KeeperCalculatorScreen() {
  // League settings (edited via modal)
  const [teams, setTeams] = useState<number>(12);
  const [yourSlot, setYourSlot] = useState<number>(11);
  const [keepersAllowed, setKeepersAllowed] = useState<number>(2);
  const [format, setFormat] = useState<LeagueFormat>('PPR');
  const [qbSlots, setQbSlots] = useState<number>(1);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Dynamic keeper pods
  const [slots, setSlots] = useState<KeeperSlot[]>([{ player: null, round: null, pick: null }]);
  const [keeperModalOpen, setKeeperModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // API state
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any | null>(null); // 👈 NEW

  useEffect(() => {
    if (yourSlot > teams) setYourSlot(teams);
  }, [teams, yourSlot]);

  const openKeeperModal = (index: number) => {
    setActiveIndex(index);
    setKeeperModalOpen(true);
  };

  const addSlot = () => {
    if (slots.length >= MAX_SLOTS) return;
    setSlots((prev) => [...prev, { player: null, round: null, pick: null }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setActiveIndex(null);
    setKeeperModalOpen(false);
  };

  const clearAll = () => {
    setSlots([{ player: null, round: null, pick: null }]);
    setResults(null); // clear results too
  };

  const settingsSummary = () =>
    `Pick ${yourSlot} in a ${teams}-team ${format} league with ${keepersAllowed} keepers and ${qbSlots} QB${qbSlots > 1 ? 's' : ''}`;

  const buildKeeperPayload = () => {
    const selected = slots
      .map((s) => {
        const overall = computeOverall(teams, s.round, s.pick);
        return s.player && s.round && s.pick && overall
          ? {
            player: `${s.player.first_name} ${s.player.last_name}`,
            keeper_overall: overall,
            meta: { round: s.round, pick: s.pick, team_abbr: s.player.team ?? '' },
          }
          : null;
      })
      .filter(Boolean) as Array<{ player: string; keeper_overall: number; meta: any }>;

    if (!selected.length) {
      Alert.alert('Add at least one keeper (player + round + pick).');
      return null;
    }
    return {
      league: { teams, format, qb_slots: qbSlots, your_slot: yourSlot, keepers_allowed: keepersAllowed },
      players: selected,
    };
  };

  const onGenerate = async () => {
    const payload = buildKeeperPayload();
    if (!payload) return;

    try {
      setLoading(true);
      setResults(null);

      // 👇 Call your new Lambda through the API service
      const data = await getKeeperRecommendations(payload.league, payload.players);

      console.log(data)

      // Expected shape from Lambda:
      // { assumptions, recommendations: { keep: [...], bench: [...] }, summary }
      setResults(data);
    } catch (e: any) {
      console.error('Keeper recs error', e?.response?.data || e?.message);
      Alert.alert('Error', 'Failed to generate keeper recommendation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Keeper Calculator</Text>

        <TouchableOpacity style={styles.settingsBanner} onPress={() => setSettingsOpen(true)}>
          <Text style={styles.settingsBannerText}>{settingsSummary()}</Text>
          <Text style={styles.settingsBannerEdit}>Edit</Text>
        </TouchableOpacity>

        {/* Keeper Pods */}
        <View style={{ gap: 12 }}>
          {slots.map((s, i) => {
            const label = s.player
              ? `${s.player.first_name} ${s.player.last_name} ${s.round ?? '-'}.${s.pick ?? '-'}`
              : 'Select keeper';
            const overall = computeOverall(teams, s.round, s.pick);

            return (
              <View key={i} style={styles.pod}>
                <TouchableOpacity onPress={() => openKeeperModal(i)} style={{ flex: 1 }}>
                  <Text style={styles.podText}>{label}</Text>
                  <Text style={styles.podSub}>
                    {overall ? `Overall ${overall}` : 'Overall —'}
                  </Text>
                </TouchableOpacity>

                <View style={styles.podActions}>
                  <TouchableOpacity onPress={() => removeSlot(i)} style={[styles.actionPill, styles.actionDanger]}>
                    <Text style={[styles.actionPillText, styles.actionDangerText]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.addKeeperBtn, slots.length >= MAX_SLOTS && { opacity: 0.5 }]}
          onPress={addSlot}
          disabled={slots.length >= MAX_SLOTS}
        >
          <Text style={styles.addKeeperText}>+ Add Keeper</Text>
          <Text style={styles.addKeeperHint}>{slots.length}/{MAX_SLOTS}</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color={theme.colors.accent} style={styles.spinner} />}

        <TouchableOpacity style={styles.accentButton} onPress={onGenerate} disabled={loading}>
          <Text style={styles.buttonText}>Get Keeper Recommendations</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dangerButton} onPress={clearAll}>
          <Text style={styles.dangerButtonText}>Reset</Text>
        </TouchableOpacity>

        {results && (
          <View style={styles.resultsCard}>
            <Text style={styles.resultsTitle}>Top Keepers</Text>
            {(results?.recommendations?.keep ?? []).map((k: any, idx: number) => (
              <View key={idx} style={styles.resultRow}>
                <Text style={styles.resultName}>
                  {idx + 1}. {k.player} — {k.keep_round}.{k.keep_pick}
                </Text>
                <Text style={styles.resultMeta}>
                  ADP ~ {k.estimated_adp_overall} | Picks saved: {k.value_vs_adp >= 0 ? '+' : ''}{k.value_vs_adp}
                </Text>
                {typeof k.capital_weight === 'number' && typeof k.adjusted_value === 'number' && (
                  <Text style={styles.resultMeta}>
                    Capital weight: ×{k.capital_weight} → Adjusted value: {k.adjusted_value.toFixed(1)}
                  </Text>
                )}
                {Array.isArray(k.risk_notes) && k.risk_notes.length > 0 && (
                  <Text style={styles.resultRisk}>Risk: {k.risk_notes.join('; ')}</Text>
                )}
                <Text style={styles.resultReason}>{k.reasoning}</Text>
              </View>
            ))}

            {results?.summary ? (
              <Text style={styles.resultsSummary}>{results.summary}</Text>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Select keeper modal combines Player + Round + Pick */}
      {activeIndex !== null && (
        <SelectKeeperModal
          visible={keeperModalOpen}
          teamsCount={teams}
          initial={slots[activeIndex]}
          onClose={() => setKeeperModalOpen(false)}
          onSave={({ player, round, pick }: { player: Player; round: number; pick: number }) => {
            setSlots((prev) => {
              const next = [...prev];
              next[activeIndex] = { player, round, pick };
              return next;
            });
            setKeeperModalOpen(false);
          }}
        />
      )}

      {/* League settings */}
      <LeagueSettingsModal
        visible={settingsOpen}
        initial={{ teams, yourSlot, keepersAllowed, format, qbSlots }}
        onClose={() => setSettingsOpen(false)}
        onSave={(next) => {
          setTeams(next.teams);
          setYourSlot(next.yourSlot);
          setKeepersAllowed(next.keepersAllowed);
          setFormat(next.format);
          setQbSlots(next.qbSlots);
          setSettingsOpen(false);
          setResults(null); // clear old results if settings change
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 20, alignItems: 'stretch' },
  title: { fontSize: 28, fontFamily: 'BebasNeue_400Regular', color: theme.colors.gold, textAlign: 'center', marginBottom: 16 },

  settingsBanner: {
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.accent,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  settingsBannerText: { color: theme.colors.text, fontWeight: '700', flexShrink: 1, paddingRight: 12 },
  settingsBannerEdit: { color: theme.colors.accent, fontWeight: '700' },

  pod: {
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  podText: { color: theme.colors.text, fontSize: 16, fontWeight: '800' },
  podSub: { color: theme.colors.mutedText, marginTop: 4, fontWeight: '700' },
  podActions: { flexDirection: 'row', gap: 8 },
  actionPill: {
    borderWidth: 1,
    borderColor: '#666',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionPillText: { color: theme.colors.text, fontWeight: '700' },
  actionDanger: { borderColor: theme.colors.danger },
  actionDangerText: { color: theme.colors.danger, fontWeight: '800' },

  addKeeperBtn: {
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addKeeperText: { color: theme.colors.text, fontWeight: '800' },
  addKeeperHint: { color: theme.colors.mutedText, fontWeight: '700' },

  spinner: { marginVertical: 20 },
  accentButton: { backgroundColor: theme.colors.accent, paddingVertical: 14, borderRadius: theme.radius.md, alignItems: 'center', marginTop: theme.spacing.sm },
  buttonText: { color: '#000', fontSize: 16, fontWeight: '700' },
  dangerButton: { backgroundColor: theme.colors.danger, paddingVertical: 14, borderRadius: theme.radius.md, alignItems: 'center', marginTop: theme.spacing.sm },
  dangerButtonText: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },

  // Results card
  resultsCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: theme.colors.card,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    borderRadius: 10,
  },
  resultsTitle: { color: theme.colors.gold, fontWeight: '800', fontSize: 16, marginBottom: 8, textAlign: 'center' },
  resultRow: { marginBottom: 10 },
  resultName: { color: theme.colors.text, fontWeight: '800' },
  resultMeta: { color: theme.colors.mutedText, marginTop: 2 },
  resultRisk: { color: theme.colors.mutedText, marginTop: 2, fontStyle: 'italic' },
  resultReason: { color: theme.colors.text, marginTop: 2 },
  resultsSummary: { color: theme.colors.text, marginTop: 8, fontWeight: '700' },
});
