import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { COLORS } from '@/src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { playAudio } from '@/src/store/reducers/audio';
import { audioSelector } from '@/src/store/selectors/AudioSelector';
import { VoiceCard } from '@/src/models/VoiceCard.Model';

interface VoicePlayerProps {
  voiceCard: VoiceCard;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ voiceCard }) => {
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
    <View style={styles.playerContainer}>
      {!isActive ?
        (
          <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
            <Ionicons name={"play"} size={30} color={COLORS.red} />
          </TouchableOpacity>
        ) :
        (
          <Text>
            Playing...
          </Text>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoicePlayer;