import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface VoicePlayerProps {
  audioUrl: string;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const togglePlayback = async () => {
    try {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) {
              setIsPlaying(false);
            } else {
              setPosition(status.positionMillis);
              setDuration(status.durationMillis || 0);
              if (status.didJustFinish) {
                setIsPlaying(false);
                newSound.setPositionAsync(0);
              }
            }
          }
        );

        setSound(newSound);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error in togglePlayback:', error);
    }
  };

  const renderWaveform = () => {
    const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
    const progressIndex = Math.floor((progressPercentage / 100) * 78);

    return (
      <View>
        <View style={styles.waveformContainer}>
          {[...Array(80)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: Math.random() * 20 + 5,
                  backgroundColor: index < progressIndex ? COLORS.red : COLORS.muted
                }
              ]}
            />
          ))}
        </View>
        <View style={styles.waveformProgress}>
          <Text style={styles.timeText}>{Math.floor(position / 1000)}</Text>
          <Text style={styles.timeText}>{Math.floor(duration / 1000)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.playerContainer}>
      {renderWaveform()}
      <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={30} color={COLORS.card} />
      </TouchableOpacity>
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
    backgroundColor: COLORS.red,
    opacity: 0.8,
    padding: 8,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 12,
    color: COLORS.text,
  },
  waveformProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default VoicePlayer;