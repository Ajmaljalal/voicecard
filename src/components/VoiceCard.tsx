import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/Colors';
import VoicePlayer from './VoicePlayer';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VoiceCardFooter from './VoiceCardFooter';

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

const VoiceCard: React.FC<VoiceCardProps> = ({ id, author, audioUrl, title, description }) => {
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
      <VoicePlayer audioUrl={audioUrl} />
      <VoiceCardFooter id={id} />
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
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default VoiceCard;