import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/Colors';
import { useAppDispatch, useAppSelector } from '@/src/store';
import { pauseAudio, resumeAudio, stopAudio } from '@/src/store/reducers/audio';
import { audioSelector } from '@/src/store/selectors/AudioSelector';

const GlobalAudioPlayer = () => {
  const dispatch = useAppDispatch();
  const { currentAudioUrl, status, position, duration, metadata } = useAppSelector(audioSelector);

  const togglePlayback = () => {
    if (status === 'paused') {
      dispatch(resumeAudio());
    } else if (status === 'playing') {
      dispatch(pauseAudio());
    }
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
        <Ionicons name={status === 'paused' ? "play" : "pause"} size={32} color={COLORS.background} />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.audioTitleHeader}>Now Playing</Text>
        <Text style={styles.audioTitle}>{metadata?.title}</Text>
        <Text style={styles.timeText}>{formatTime(position)} / {formatTime(duration)}</Text>
      </View>
      <TouchableOpacity onPress={handleStop} style={styles.closeButton}>
        <Ionicons name="close" size={32} color={COLORS.background} />
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
    backgroundColor: "black",
    flexDirection: 'row',
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
  audioTitleHeader: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  audioTitle: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: COLORS.background,
    fontSize: 12,
    marginTop: 5,
  },
  closeButton: {
    padding: 10,
  },
});

export default GlobalAudioPlayer;


