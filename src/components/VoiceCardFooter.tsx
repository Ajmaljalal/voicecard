import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

const VoiceCardFooter: React.FC<{ onReply: () => void }> = ({ onReply }) => (
  <View style={styles.cardFooter}>
    <TouchableOpacity onPress={onReply} style={styles.replyButton}>
      <Ionicons name="mic" size={24} color={COLORS.red} />
    </TouchableOpacity>
    <Ionicons name="trending-up" size={24} color={COLORS.dark} />
  </View>
);

const styles = StyleSheet.create({
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyButton: {
    paddingTop: 5,
    width: 30,
    height: 35,
    borderWidth: 0.5,
    borderColor: COLORS.muted,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceCardFooter;
