import React from 'react';
import { StyleSheet, FlatList } from 'react-native';
import VoiceCardComment from './VoiceCardComment';


interface VoiceCardRepliesListProps {
  replies: any[];
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
    paddingBottom: 24,
    gap: 4,
  },
});

export default VoiceCardRepliesList;
