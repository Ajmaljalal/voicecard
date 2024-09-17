import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/Colors';
import VoicePlayer from './VoicePlayer';
import { useRouter } from 'expo-router';
import { VoiceCardProps } from './VoiceCard';


const VoiceCardDetails: React.FC<VoiceCardProps> = ({ id, author, audioUrl, title, description }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/voicecard-detail/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.cardContainer}>
      <View style={styles.cardTextContainer}>
        <Text style={styles.author}>{author.name}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <VoicePlayer audioUrl={audioUrl} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 24,
  },
  cardTextContainer: {
    // flex: 1,
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