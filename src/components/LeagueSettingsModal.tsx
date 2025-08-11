import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { theme } from '../utils/constants';
import { ModalPicker } from './ModalPicker';

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export const FORMAT_OPTIONS = ['PPR', 'Half-PPR', 'Standard'] as const;
export type LeagueFormat = typeof FORMAT_OPTIONS[number];

type Props = {
  visible: boolean;
  initial: {
    teams: number;
    yourSlot: number;
    keepersAllowed: number;
    format: LeagueFormat;
    qbSlots: number;
  };
  onClose: () => void;
  onSave: (next: {
    teams: number;
    yourSlot: number;
    keepersAllowed: number;
    format: LeagueFormat;
    qbSlots: number;
  }) => void;
};

export default function LeagueSettingsModal({
  visible,
  initial,
  onClose,
  onSave,
}: Props) {
  const [teams, setTeams] = useState(initial.teams);
  const [yourSlot, setYourSlot] = useState(initial.yourSlot);
  const [keepersAllowed, setKeepersAllowed] = useState(initial.keepersAllowed);
  const [format, setFormat] = useState<LeagueFormat>(initial.format);
  const [qbSlots, setQbSlots] = useState(initial.qbSlots);

  const pickOptions = useMemo(() => range(teams), [teams]);

  useEffect(() => {
    if (yourSlot > teams) setYourSlot(teams);
  }, [teams, yourSlot]);

  useEffect(() => {
    if (visible) {
      setTeams(initial.teams);
      setYourSlot(initial.yourSlot);
      setKeepersAllowed(initial.keepersAllowed);
      setFormat(initial.format);
      setQbSlots(initial.qbSlots);
    }
  }, [visible, initial]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <Text style={styles.modalTitle}>League Settings</Text>

          <View style={styles.controlsRow}>
            <View style={styles.control}>
              <Text style={styles.controlLabel}>Teams</Text>
              <ModalPicker
                title="Select Teams"
                value={teams}
                options={range(18)}
                onChange={setTeams}
              />
            </View>

            <View style={styles.control}>
              <Text style={styles.controlLabel}>Your Pick (R1)</Text>
              <ModalPicker
                title="Select Your R1 Pick"
                value={yourSlot}
                options={pickOptions}
                onChange={setYourSlot}
              />
            </View>
          </View>

          <View style={styles.controlsRow}>
            <View style={styles.control}>
              <Text style={styles.controlLabel}>Keepers Allowed</Text>
              <ModalPicker
                title="Select Keepers Allowed"
                value={keepersAllowed}
                options={[1, 2, 3, 4, 5, 6]}
                onChange={setKeepersAllowed}
              />
            </View>

            <View style={styles.control}>
              <Text style={styles.controlLabel}>QB Slots</Text>
              <ModalPicker
                title="Select QB Slots"
                value={qbSlots}
                options={[1, 2]}
                onChange={setQbSlots}
              />
            </View>
          </View>

          <View style={styles.formatBlock}>
            <Text style={styles.controlLabel}>Format</Text>
            <View style={styles.formatRow}>
              {FORMAT_OPTIONS.map((opt) => {
                const active = opt === format;
                return (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setFormat(opt)}
                    style={[styles.formatPill, active && styles.formatPillActive]}
                  >
                    <Text style={[styles.formatPillText, active && styles.formatPillTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity onPress={onClose} style={[styles.modalBtn, styles.modalBtnCancel]}>
              <Text style={styles.modalBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onSave({ teams, yourSlot, keepersAllowed, format, qbSlots })}
              style={[styles.modalBtn, styles.modalBtnSave]}
            >
              <Text style={[styles.modalBtnText, { color: '#000' }]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  control: { flex: 1 },
  controlLabel: {
    color: theme.colors.text,
    marginBottom: 6,
    fontWeight: '600',
  },
  formatBlock: { marginTop: 4, marginBottom: 10 },
  formatRow: { flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' },
  formatPill: {
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  formatPillActive: { backgroundColor: theme.colors.accent },
  formatPillText: { color: theme.colors.text, fontWeight: '700' },
  formatPillTextActive: { color: '#000', fontWeight: '800' },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnCancel: {
    backgroundColor: '#333',
  },
  modalBtnSave: {
    backgroundColor: theme.colors.accent,
  },
  modalBtnText: { color: theme.colors.text, fontWeight: '700' },
});
