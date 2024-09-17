import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const VoiceCardFooter: React.FC<{ id: string }> = ({ id }) => (
  <View style={styles.cardFooter}>
    <Ionicons name="trending-up" size={24} color={COLORS.dark} />
    <TouchableOpacity>
      <Ionicons name="mic" size={24} color={COLORS.dark} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  cardFooter: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default VoiceCardFooter;
