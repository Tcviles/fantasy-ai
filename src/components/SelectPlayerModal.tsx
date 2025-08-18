import React, { useContext, useEffect, useState } from 'react';
import {
  Modal, View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Button, ScrollView
} from 'react-native';
import { NFL_TEAMS, POSITIONS, theme } from '../utils/constants';
import { Player } from '../utils/types';
import { AppContext } from '../context/AppContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  filterPlayers?: Player[];
};

export default function SelectPlayerModal({
  visible, onClose, onSelectPlayer, filterPlayers = []
}: Props) {
  const { state: { players: allPlayers } } = useContext(AppContext);

  const [selectedPos, setSelectedPos] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const filter = allPlayers.filter(
        (p: Player) => {
          const notInSheet = !filterPlayers.some(fp => fp.player_id === p.player_id);
          const matchesPos = selectedPos ? p.position === selectedPos : true;
          const matchesTeam = selectedTeam ? p.team === selectedTeam : true;
          return notInSheet && matchesPos && matchesTeam;
        }
      );
      setFilteredPlayers(filter);
      setLoading(false);
    }, 100);

    return () => clearTimeout(timeout);
  }, [selectedPos, selectedTeam, allPlayers, filterPlayers]);

  const togglePos = (pos: string) => {
    setSelectedPos(prev => (prev === pos ? null : pos));
  };

  const toggleTeam = (team: string) => {
    setSelectedTeam(prev => (prev === team ? null : team));
  };

  const renderFilterButtons = (items: string[], selected: string | null, toggleFn: (val: string) => void, columns: number) => (
    <View style={[styles.gridWrap, { flexDirection: 'row', flexWrap: 'wrap' }]}>
      {items.map(item => (
        <TouchableOpacity
          key={item}
          onPress={() => toggleFn(item)}
          style={[styles.filterBtn, selected === item && styles.activeFilter]}
        >
          <Text style={[styles.filterText, selected === item && styles.activeFilterText]}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Select a Player</Text>

        <View style={styles.filterRowContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.filterTitle}>Position</Text>
            {renderFilterButtons(POSITIONS, selectedPos, togglePos, 1)}
          </View>
          <View style={{ flex: 3 }}>
            <Text style={styles.filterTitle}>Team</Text>
            {renderFilterButtons(NFL_TEAMS, selectedTeam, toggleTeam, 3)}
          </View>
        </View>

        <View style={{ flex: 1, marginTop: 16 }}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.accent} />
          ) : (
            <FlatList
              data={filteredPlayers}
              keyExtractor={(item) => String(item.player_id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelectPlayer(item);
                    setSelectedPos(null);
                    setSelectedTeam(null);
                    onClose();
                  }}
                  style={styles.listRow}
                >
                  <Text style={styles.listRowText}>
                    {item.first_name} {item.last_name} ({item.team})
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        <View style={styles.footerRow}>
          <Button
            title="Cancel"
            color={theme.colors.danger}
            onPress={() => {
              setSelectedPos(null);
              setSelectedTeam(null);
              onClose();
            }} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, padding: 20, backgroundColor: theme.colors.background },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: theme.colors.gold },
  filterTitle: { fontSize: 16, marginBottom: 6, fontWeight: '600', color: theme.colors.text },
  filterRowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  activeFilter: {
    backgroundColor: theme.colors.accent,
  },
  filterText: { color: theme.colors.text, fontWeight: '600', fontSize: 14 },
  activeFilterText: { color: theme.colors.background },
  listRow: { padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: '#333' },
  listRowText: { color: theme.colors.text, fontSize: 16, fontWeight: '600' },
  footerRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
