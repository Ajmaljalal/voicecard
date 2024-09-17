import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Colors';

const SoundWaves: React.FC<{ position: number; duration: number, waveCount?: number }> = ({ position, duration, waveCount = 100 }) => {
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const progressIndex = Math.floor((progressPercentage / 100) * 78);

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