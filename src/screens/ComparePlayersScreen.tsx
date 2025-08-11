import React, { useState } from 'react';
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
import { fetchPlayersByPosition, comparePlayers } from '../services/api';
import RecommendationModal from '../components/RecommendationModal';
import SelectPlayerModal from '../components/SelectPlayerModal';

export default function ComparePlayersScreen() {
  const [selectedPlayers, setSelectedPlayers] = useState<(any | null)[]>(Array(6).fill(null));
  const [modalVisible, setModalVisible] = useState(false);
  const [positionPickerIndex, setPositionPickerIndex] = useState<number | null>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [position, setPosition] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shortAnswer, setShortAnswer] = useState('');
  const [longAnswer, setLongAnswer] = useState('');
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  // light lm
  // cosmos vs dyanmo
  // synapse
  // machine learning model vs llm (no llm)
  // oriely ai engineering


  const selectPlayer = (index: number) => {
    setPositionPickerIndex(index);
    setModalVisible(true);
  };

  const handlePlayerSelect = (player: any) => {
    if (positionPickerIndex !== null) {
      const updated = [...selectedPlayers];
      updated[positionPickerIndex] = player;
      setSelectedPlayers(updated);
      setModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Compare Players</Text>

        <View style={styles.playerGrid}>
          {selectedPlayers.map((p, i) => {
            const label = p
              ? `${p.first_name} ${p.last_name} (${p.team})`
              : `Select Player ${i + 1}`;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => selectPlayer(i)}
                style={styles.playerSlot}
              >
                <View style={styles.playerContent}>
                  <Text style={styles.playerText}>{label}</Text>
                  <View style={styles.iconRow}>
                    {p?.is_favorite && <Text style={styles.favoriteIcon}>⭐</Text>}
                    {p?.is_injured && <Text style={styles.injuryIcon}>⚠️</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {loading && <ActivityIndicator size="large" color={theme.colors.accent} style={styles.spinner} />}

        <TouchableOpacity
          style={[
            styles.accentButton,
            (selectedPlayers.filter(p => p).length < 2 || loading) && styles.disabledButton
          ]}
          onPress={async () => {
            const validPlayers = selectedPlayers.filter(p => p !== null);
            if (validPlayers.length < 2) {
              Alert.alert('Select at least two players to compare.');
              return;
            }

            try {
              setLoading(true);
              const recommendation = await comparePlayers(validPlayers);

              const shortAnswerMatch = recommendation.match(/1\.\s?\*\*Recommendation\*\*:?\s?(.*)/i);
              const longAnswerMatch = recommendation.match(/2\.\s?\*\*Reasoning\*\*:?\s?([\s\S]*)/i);

              const shortAnswer = shortAnswerMatch?.[1]?.trim() || "No recommendation found.";
              const longAnswer = longAnswerMatch?.[1]?.trim() || "";
              setShortAnswer(shortAnswer);
              setLongAnswer(longAnswer);
              setShowRecommendationModal(true);
            } catch (error) {
              Alert.alert('Error', 'Failed to get a recommendation.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={selectedPlayers.filter(p => p).length < 2 || loading}
        >
          <Text style={[
            styles.buttonText,
            (selectedPlayers.filter(p => p).length < 2 || loading) && styles.disabledButtonText
          ]}>
            Compare
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => setSelectedPlayers(Array(6).fill(null))}
        >
          <Text style={styles.dangerButtonText}>Clear All</Text>
        </TouchableOpacity>
      </ScrollView>

      <SelectPlayerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectPlayer={handlePlayerSelect}
      />

      <RecommendationModal
        visible={showRecommendationModal}
        onClose={() => setShowRecommendationModal(false)}
        shortAnswer={shortAnswer}
        longAnswer={longAnswer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scroll: { padding: 20, alignItems: 'stretch' },
  title: {
    fontSize: 28,
    fontFamily: 'BebasNeue_400Regular',
    color: theme.colors.gold,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: { marginTop: 10 },
  spinner: { marginVertical: 20 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: theme.colors.background },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: theme.colors.gold,
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: theme.colors.text,
  },
  modalText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  modalButton: { marginTop: 20 },
  accentButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  disabledButton: {
    backgroundColor: '#444',
  },
  buttonText: {
    color: '#000', // black text on bright green
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButtonText: {
    color: theme.colors.mutedText,
  },
  dangerButton: {
    backgroundColor: theme.colors.danger,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  dangerButtonText: {
    color: theme.colors.text, // white text
    fontSize: 16,
    fontWeight: '700',
  },
  playerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  playerSlot: {
    backgroundColor: theme.colors.card,
    padding: 20,
    marginBottom: theme.spacing.sm,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    width: '48%', // two columns
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  playerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  injuryIcon: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
    justifyContent: 'center',
  },
  favoriteIcon: {
    color: theme.colors.gold,
    fontSize: 14,
    fontWeight: '600',
  },
});
