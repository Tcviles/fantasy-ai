import React from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { theme } from '../utils/constants'; // adjust path as needed

interface RecommendationModalProps {
  visible: boolean;
  onClose: () => void;
  shortAnswer: string;
  longAnswer: string;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({
  visible,
  onClose,
  shortAnswer,
  longAnswer,
}) => {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popup}>
              <Text style={styles.title}>🏆 Recommendation</Text>
              <ScrollView style={styles.scroll}>
                <Text style={styles.shortAnswer}>{shortAnswer}</Text>
                <Text style={styles.longAnswer}>{longAnswer}</Text>
              </ScrollView>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  popup: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  scroll: {
    marginBottom: theme.spacing.md,
  },
  shortAnswer: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
    textAlign: 'center',
  },
  longAnswer: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.mutedText,
    textAlign: 'left',
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    color: '#000', // Black text to contrast the bright green
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RecommendationModal;
