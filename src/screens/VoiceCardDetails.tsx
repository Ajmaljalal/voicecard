import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';
import { VoiceCardProps } from '../components/voicecard/VoiceCard';
import VoiceCardDetails from '../components/voicecard/VoiceCardDetails';


const DetailScreen = ({ voiceCard }: { voiceCard: VoiceCardProps }) => {

  return (
    <View style={styles.container}>
      <VoiceCardDetails {...voiceCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.background,
    height: '100%',

  },
  text: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
});

export default DetailScreen;