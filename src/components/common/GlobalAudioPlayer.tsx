import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { pauseAudio, resumeAudio, stopAudio } from '@/src/store/reducers/audio';
import { audioSelector } from '@/src/store/selectors/AudioSelector';


const GlobalAudioPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentAudioUrl, isPlaying, position, duration } = useAppSelector(audioSelector);


  const togglePlayback = () => isPlaying ? handlePause() : handleResume();

  const handlePause = () => {
    dispatch(pauseAudio());
  };

  const handleResume = () => {
    dispatch(resumeAudio());
  };

  const handleStop = () => {
    dispatch(stopAudio());
  };

  if (!currentAudioUrl) {
    return null;
  }

  // Format time in mm:ss
  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayback} style={styles.controlButton}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={COLORS.background} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.audioTitle}>Now Playing</Text>
        <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
      </View>
      <TouchableOpacity onPress={handleStop} style={styles.closeButton}>
        <Ionicons name="close" size={24} color={COLORS.background} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0, // You can change to 'top' if preferred
    left: 0,
    right: 0,
    backgroundColor: COLORS.dark,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    zIndex: 1000,
    height: 100,
    opacity: 0.9,
  },
  controlButton: {
    padding: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  audioTitle: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: COLORS.background,
    fontSize: 14,
  },
  closeButton: {
    padding: 10,
  },
});

export default GlobalAudioPlayer;


