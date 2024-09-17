import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';
import VoicePlayer from './VoicePlayer';
import { useRouter } from 'expo-router';
import { VoiceCardProps } from './VoiceCard';
import VoiceCardFooter from './VoiceCardFooter';
import VoiceCardRepliesList from './VoiceCardRepliesList';

const dummyReplies = [
  {
    id: '1',
    owner: { name: 'Alice Born', avatarUrl: 'https://example.com/avatar1.png' },
    audioUrl: 'https://example.com/audio1.mp3',
  },
  {
    id: '2',
    owner: { name: 'Elon Musk', avatarUrl: 'https://example.com/avatar2.png' },
    audioUrl: 'https://example.com/audio2.mp3',
  },
  {
    id: '3',
    owner: { name: 'Chadwick Boseman', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
  {
    id: '4',
    owner: { name: 'Clint Eastwood', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
  {
    id: '5',
    owner: { name: 'Morgan Freeman', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
  {
    id: '6',
    owner: { name: 'Denzel Washington', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
  {
    id: '7',
    owner: { name: 'Tom Hanks', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
  {
    id: '8',
    owner: { name: 'Meryl Streep', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
  {
    id: '9',
    owner: { name: 'Scarlett Johansson', avatarUrl: 'https://example.com/avatar3.png' },
    audioUrl: 'https://example.com/audio3.mp3',
  },
];

const VoiceCardDetails: React.FC<VoiceCardProps> = ({ id, author, audioUrl, title, description }) => {

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.author}>{author.name}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <VoicePlayer audioUrl={audioUrl} />
        <VoiceCardFooter id={id} />
      </View>
      <VoiceCardRepliesList replies={dummyReplies} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  cardContainer: {
    backgroundColor: COLORS.background,
    padding: 24,
    paddingBottom: 15,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: COLORS.muted,
    marginBottom: 12,
    height: 280,
  },
  cardTextContainer: {
    marginBottom: 12,
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
});

export default VoiceCardDetails;