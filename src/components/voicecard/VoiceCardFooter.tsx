import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/Colors';
import VoiceRecordButton from '../common/VoiceRecordButton';

const VoiceCardFooter: React.FC<{ parentVoiceCardId: string }> = ({ parentVoiceCardId }) => {

  return (
    <View style={styles.cardFooter}>
      <VoiceRecordButton size={20} parentVoiceCardId={parentVoiceCardId} />
      <Ionicons name="trending-up" size={20} color={COLORS.dark} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default VoiceCardFooter;
