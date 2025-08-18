import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList, ChecklistItem, isPlayerItem } from '../utils/types';
import { theme } from '../utils/constants';

type DraftChecklistRouteProp = RouteProp<RootStackParamList, 'DraftChecklistView'>;

export default function DraftChecklistView() {
  const { params } = useRoute<DraftChecklistRouteProp>();
  const originalPlayers = params?.sheet?.players || [];
  const [hideDrafted, setHideDrafted] = useState(false);
  const [positionFilter, setPositionFilter] = useState<string | null>(null);
  const [localPlayers, setLocalPlayers] = useState(
    originalPlayers.map((p: any) =>
      p.type === 'tier' ? p : { ...p, type: 'player', drafted: false }
    )
  );

  const toggleDrafted = (player_id: number | string) => {
    console.log("toggling ", player_id)
    setLocalPlayers((prev: ChecklistItem[]) =>
      prev.map((item) => {
        if (isPlayerItem(item)) {
          if (String(item.player_id) === String(player_id)) {
            const newItem = { ...item, drafted: !item.drafted };
            return newItem
          }
        }
        return item;
      })
    );
  };

  const visiblePlayers = useMemo(() => {
    return localPlayers.filter((p: ChecklistItem) => {
      if (!isPlayerItem(p)) return true; // It's a tier — always show

      if (hideDrafted && p.drafted) return false;
      if (positionFilter && p.position !== positionFilter) return false;

      return true;
    });
  }, [localPlayers, hideDrafted, positionFilter]);



  const renderPlayer = ({ item, index }: any) => {
    if (item.type === 'tier') {
      return (
        <View style={styles.tierRow}>
          <Text style={styles.tierText}>{item.title}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.playerItem,
          item.drafted && styles.draftedItem,
        ]}
        onPress={() => toggleDrafted(item.player_id)}
      >
        <Text style={[styles.playerText, item.drafted && styles.draftedText]}>
          {item.first_name} {item.last_name} ({item.team} - {item.position})
        </Text>
      </TouchableOpacity>
    );

  };

  const renderPositionFilters = () => {
    const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'DEF'];

    return (
      <View style={styles.positionFilterContainer}>
        {positions.map((pos) => (
          <TouchableOpacity
            key={pos}
            style={[
              styles.positionButton,
              positionFilter === pos && styles.selectedPositionButton,
            ]}
            onPress={() => {
              setPositionFilter(positionFilter === pos ? null : pos);
            }}
          >
            <Text
              style={[
                styles.positionButtonText,
                positionFilter === pos && styles.selectedPositionButtonText,
              ]}
            >
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draft Checklist</Text>

      {renderPositionFilters()}

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Hide Drafted:</Text>
        <Switch
          value={hideDrafted}
          onValueChange={setHideDrafted}
          trackColor={{ true: theme.colors.accent }}
        />
      </View>

      <FlatList
        data={visiblePlayers}
        keyExtractor={(item, index) => {
          if (isPlayerItem(item)) {
            return `player-${item.player_id}`;
          }
          return `tier-${item.title || 'untitled'}-${index}`;
        }}
        renderItem={renderPlayer}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.gold,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  playerItem: {
    padding: 12,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  playerText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  tierRow: {
    paddingVertical: 8,
    backgroundColor: theme.colors.accent,
    borderRadius: 6,
    marginVertical: 6,
  },
  tierText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.background,
    textAlign: 'center',
  },
  positionFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  positionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedPositionButton: {
    backgroundColor: theme.colors.accent,
  },
  positionButtonText: {
    color: theme.colors.accent,
  },
  selectedPositionButtonText: {
    color: theme.colors.background,
  },
  draftedItem: {
    backgroundColor: theme.colors.disabledBackground || '#ccc', // fallback
    borderColor: theme.colors.disabledText || '#888',
  },
  draftedText: {
    color: theme.colors.disabledText || '#666',
    textDecorationLine: 'line-through',
  },

});
