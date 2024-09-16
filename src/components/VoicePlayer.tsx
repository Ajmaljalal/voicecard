import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { COLORS } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface VoicePlayerProps {
  audioUrl: string;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSound = async () => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      if (isMounted) {
        soundRef.current = newSound;
      }
    };

    loadSound();
    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [audioUrl]);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const togglePlayback = async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.didJustFinish) {
          await soundRef.current.replayAsync();
        } else {
          await soundRef.current.playAsync();
        }
      }
    }
  };

  const renderWaveform = () => {
    const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
    const progressIndex = Math.floor((progressPercentage / 100) * 78);

    return (
      <View style={styles.waveformContainer}>
        {[...Array(76)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.waveformBar,
              {
                height: Math.random() * 20 + 5,
                backgroundColor: index < progressIndex ? COLORS.red : 'lightgray'
              }
            ]}
          />
        ))}

      </View>
    );
  };

  return (
    <View style={styles.playerContainer}>
      {renderWaveform()}
      <View style={styles.waveformProgress}>
        <Text style={styles.timeTextPosition}>{Math.floor(position / 1000 / 60)}:{Math.floor(position / 1000) % 60}</Text>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={30} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.timeTextDuration}>{Math.floor(duration / 1000 / 60)}:{Math.floor(duration / 1000) % 60}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 10,
    width: '100%',
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
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