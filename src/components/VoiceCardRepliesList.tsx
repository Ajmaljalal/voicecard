import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import VoiceCardReply from './VoiceCardReply';

interface VoiceCardRepliesListProps {
  replies: any[];
}

const VoiceCardRepliesList: React.FC<VoiceCardRepliesListProps> = ({ replies }) => {
  return (
    <FlatList
      data={replies}
      keyExtractor={(reply) => reply.id.toString()}
      renderItem={({ item }) => <VoiceCardReply {...item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
    maxHeight: 300,
    gap: 4,
  },
});

export default VoiceCardRepliesList;
