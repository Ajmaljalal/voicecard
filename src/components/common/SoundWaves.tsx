import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { useAudioPlayer } from '@/src/hooks/useAudioPlayer';

const SoundWaves: React.FC<{ waveCount?: number }> = ({ waveCount = 100 }) => {
  const { position, duration, currentAudioUrl } = useAudioPlayer();
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const progressIndex = Math.floor((progressPercentage / 100) * 100);


  return (
    <View style={styles.waveformContainer}>
      {[...Array(waveCount)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: Math.random() * 20 + 5,
              backgroundColor: index < progressIndex ? COLORS.red : 'lightgray'
            }
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    overflow: 'hidden',
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    borderRadius: 1,
  },
});

export default SoundWaves;