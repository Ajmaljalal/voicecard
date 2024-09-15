import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Colors';
import VoicePlayer from './VoicePlayer';

interface VoiceCardProps {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  audioUrl: string;
  title: string;
  description: string;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ author, audioUrl, title, description }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <VoicePlayer audioUrl={audioUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.background,
    padding: 24,
    borderRadius: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    elevation: 1,
    height: '100%',
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'lightgray',
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
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.text,
    marginBottom: 32,
  },
});

export default VoiceCard;