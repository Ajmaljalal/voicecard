import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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
  const { currentAudioUrl, isPlaying } = useAppSelector(audioSelector);

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

  const isActive = isPlaying && currentAudioUrl === voiceCard.audioUrl;


  return (
    <View style={styles.playerContainer}>
      {/* <SoundWaves position={position} duration={duration} /> */}
      {/* <View style={styles.waveformProgress}> */}
      {/* <Text style={styles.timeTextPosition}>{formatTime(position)}</Text> */}
      <TouchableOpacity onPress={handlePlay} style={styles.playButton}>
        <Ionicons name={isActive ? "pause" : "play"} size={30} color={COLORS.red} />
      </TouchableOpacity>
      {/* <Text style={styles.timeTextDuration}>{formatTime(duration)}</Text> */}
      {/* </View> */}
    </View>
  );
};

// // Utility function to format time
// const formatTime = (millis: number) => {
//   const totalSeconds = Math.floor(millis / 1000);
//   const minutes = Math.floor(totalSeconds / 60);
//   const seconds = totalSeconds % 60;
//   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
// };

const styles = StyleSheet.create({
  playerContainer: {
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  playButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTextDuration: {
    fontSize: 12,
    color: COLORS.text,
    width: 50,
    textAlign: 'right',
  },
  timeTextPosition: {
    fontSize: 12,
    color: COLORS.text,
    width: 50,
    textAlign: 'left',
  },
  waveformProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
});

export default VoicePlayer;