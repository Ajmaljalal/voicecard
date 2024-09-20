import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import VoiceCardComment from './VoiceCardComment';
import { VoiceCard } from '@/src/models/VoiceCard.Model';


interface VoiceCardRepliesListProps {
  replies: VoiceCard[];
}

const VoiceCardRepliesList: React.FC<VoiceCardRepliesListProps> = ({ replies }) => {
  return (
    <FlatList
      data={replies}
      keyExtractor={(reply) => reply.id.toString()}
      renderItem={({ item }) => <VoiceCardComment {...item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    paddingBottom: 24,
    gap: 4,
  },
});

export default VoiceCardRepliesList;
