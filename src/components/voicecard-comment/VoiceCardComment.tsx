import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av'; // Ensure you have this package installed
import SoundWaves from '@/src/components/common/SoundWaves';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/Colors';
import { VoiceCard } from '@/src/models/VoiceCard.Model';
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer';

export interface VoiceCardReplyProps extends VoiceCard { }

const VoiceCardReply: React.FC<VoiceCardReplyProps> = ({ author, audioUrl }) => {
  const { isPlaying, togglePlayback } = useAudioPlayer();

  return (
    <View style={styles.replyContainer}>
      <View style={styles.nameContainer}>
        <Text
          style={styles.ownerName}
          numberOfLines={1} // Prevents text from wrapping
        >
          {`${author.name}`}
        </Text>
      </View>
      <View style={styles.audioContainer}>
        <SoundWaves position={0} duration={2} waveCount={50} />
      </View>
      <TouchableOpacity onPress={() => togglePlayback(audioUrl)}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color={COLORS.red} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 0.5,
    borderColor: COLORS.muted,
    overflow: 'hidden',
    gap: 4,
    width: '100%',
    borderRadius: 10,
  },
  nameContainer: {
    backgroundColor: COLORS.dark,
    borderRadius: 5,
    padding: 8,
    maxWidth: 80,
    width: 80,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerName: {
    fontSize: 12,
    color: 'white',
    overflow: 'hidden', // Changed from textOverflow to overflow
  },
  audioContainer: {
    flex: 1,
  },
});

export default VoiceCardReply;
