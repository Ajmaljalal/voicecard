import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '@/src/constants/Colors';
import VoicePlayer from '@/src/components/voice-player/VoicePlayer';
import { useRouter } from 'expo-router';
import VoiceCardFooter from './VoiceCardFooter';
import SoundWaves from '../common/SoundWaves';

export interface VoiceCardProps {
  id: string;
  author: {
    name: string;
    id: string;
  };
  location: string;
  createdAt: string;
  audioUrl: string;
  title: string;
  description: string;
}

const VoiceCard = ({ id, author, audioUrl, title, description }: VoiceCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/voicecard-detail/${id}`);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.cardContainer}
      activeOpacity={1}
    >
      <View style={styles.cardTextContainer}>
        <Text style={styles.author}>{author.name}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.audioContainer}>
        <SoundWaves waveCount={100} voiceCard={
          {
            id,
            author,
            audioUrl,
            title,
            description,
          }
        } />
      </View>
      <VoicePlayer voiceCard={{
        id,
        author,
        audioUrl,
        title,
        description,
      }} />
      <VoiceCardFooter parentVoiceCardId={id} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.background,
    padding: 24,
    paddingBottom: 15,
    borderRadius: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
    height: '100%',
    width: '100%',
    borderWidth: 0.5,
    borderColor: COLORS.dark,
    flex: 1,
    justifyContent: 'space-between',
    position: 'relative',
  },
  cardTextContainer: {
    marginBottom: 24,
  },
  author: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
  },
  audioContainer: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.muted,
    padding: 10,
    borderRadius: 20,
  },
  replyText: {
    marginLeft: 5,
    color: COLORS.dark,
    fontSize: 14,
  },
});

export default VoiceCard;