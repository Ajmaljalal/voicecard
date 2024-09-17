import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av'; // Ensure you have this package installed
import SoundWaves from './common/SoundWaves';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

export interface VoiceCardReplyProps {
  id: string;
  owner: {
    name: string;
    avatarUrl: string; // URL for the avatar image
  };
  audioUrl: string;
}

const VoiceCardReply: React.FC<VoiceCardReplyProps> = ({ owner, audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const handlePlayPause = async () => {
    if (isPlaying) {
      await sound?.pauseAsync();
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      await newSound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.replyContainer}>
      <View style={styles.nameContainer}>
        <Text
          style={styles.ownerName}
          numberOfLines={1} // Prevents text from wrapping
        >
          {`${owner.name}`}
        </Text>
      </View>
      <View style={styles.audioContainer}>
        <SoundWaves position={0} duration={2} waveCount={50} />
      </View>
      <TouchableOpacity onPress={handlePlayPause}>
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
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    overflow: 'hidden',
    gap: 8,
    width: '100%',
  },
  nameContainer: {
    backgroundColor: COLORS.dark,
    borderRadius: 5,
    padding: 8,
    maxWidth: 100,
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
