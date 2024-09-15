import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/Colors';


const DetailScreen = ({ id }: { id: string }) => {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>VoiceCard Detail Screen</Text>
      <Text style={styles.text}>VoiceCard ID: {id}</Text>
      {/* Implement further details and replies here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
  },
  text: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
});

export default DetailScreen;