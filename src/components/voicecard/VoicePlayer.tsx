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

  const getAndPlayVoiceMessage = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      {
        shouldPlay: false,
        progressUpdateIntervalMillis: 100,
        positionMillis: 0,
      },
      (status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 0);
          if (status.didJustFinish) {
            setIsPlaying(false);
            newSound.setPositionAsync(0);
          }
        }
      }
    );
    newSound.setPositionAsync(2000);
    return newSound;
  };

  useEffect(() => {
    getAndPlayVoiceMessage().then((newSound) => {
      setSound(newSound);
    });
    return () => {
      if (sound) {
        sound.pauseAsync();
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const togglePlayback = async () => {
    try {
      if (sound) {
        console.log('sound exists')
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        const newSound = await getAndPlayVoiceMessage();
        await newSound.playAsync();
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
        <Text style={styles.timeText}>{Math.floor(position / 1000 / 60)}:{Math.floor(position / 1000) % 60}</Text>
        <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={30} color={COLORS.red} />
        </TouchableOpacity>
        <Text style={styles.timeText}>{Math.floor(duration / 1000 / 60)}:{Math.floor(duration / 1000) % 60}</Text>
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
    opacity: 0.8,
    padding: 8,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.red,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.text,
  },
  waveformProgress: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
});

export default VoicePlayer;