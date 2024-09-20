import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Colors';
import VoicePlayer from '@/src/components/voice-player/VoicePlayer';
import { VoiceCardProps } from './VoiceCard';
import VoiceCardFooter from '@/src/components/voicecard/VoiceCardFooter';
import VoiceCardRepliesList from '../voicecard-comment/VoiceCardCommentsList';
import { useGetVoiceCardCommentsQuery } from '@/src/store/api/VoiceCardApi';
import LoadingSpinner from '../common/LoadingSpinner';

const VoiceCardDetails: React.FC<VoiceCardProps> = ({ id, author, audioUrl, title, description }) => {
  const { data: replies, isLoading } = useGetVoiceCardCommentsQuery(id);

  if (isLoading) {
    return <LoadingSpinner />;
  }


  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.author}>{author.name}</Text>
          <Text style={styles.title} numberOfLines={1}>{title} </Text>
          <Text style={styles.description} numberOfLines={2}>{description}</Text>
        </View>
        <VoicePlayer audioUrl={audioUrl} />
        <VoiceCardFooter parentVoiceCardId={id} />
      </View>
      <VoiceCardRepliesList replies={replies || []} />
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
    height: 270,
  },
  cardTextContainer: {
    marginBottom: 0
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
    height: 40,
    maxHeight: 40,
  },
});

export default VoiceCardDetails;