import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SoundWaves from '@/src/components/common/SoundWaves';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/Colors';
import { VoiceCard } from '@/src/models/VoiceCard.Model';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { audioSelector } from '@/src/store/selectors/AudioSelector';
import { playAudio } from '@/src/store/reducers/audio';

export interface VoiceCardReplyProps {
  voiceCard: VoiceCard;
}

const VoiceCardReply: React.FC<VoiceCardReplyProps> = ({ voiceCard }) => {
  const dispatch = useAppDispatch();
  const { currentAudioUrl, status } = useAppSelector(audioSelector);

  const handlePlay = () => {
    dispatch(playAudio({
      audioUrl: voiceCard.audioUrl,
      metadata: {
        voiceCardId: voiceCard.id,
        title: voiceCard.title,
        description: voiceCard.description,
        author: voiceCard.author.name,
      },
    }));
  };

  const isActive = status === 'playing' && currentAudioUrl === voiceCard.audioUrl;


  return (
    <View style={styles.replyContainer}>
      <View style={styles.nameContainer}>
        <Text
          style={styles.ownerName}
          numberOfLines={1} // Prevents text from wrapping
        >
          {`${voiceCard.author.name}`}
        </Text>
      </View>
      <View style={styles.audioContainer}>
        <SoundWaves waveCount={100} voiceCard={voiceCard} />
      </View>
      <TouchableOpacity onPress={handlePlay}>
        <Ionicons name={isActive ? 'pause' : 'play'} size={30} color={COLORS.red} />
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
