import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/Colors';
import { useAppSelector } from '@/src/store';
import { audioSelector } from '@/src/store/selectors/AudioSelector';
import { VoiceCard } from '@/src/models/VoiceCard.Model';

interface SoundWavesProps {
  waveCount?: number;
  voiceCard: VoiceCard;
}

const SoundWaves = ({ waveCount = 100, voiceCard }: SoundWavesProps) => {
  const { position, duration, currentAudioUrl, status } = useAppSelector(audioSelector);
  const progressPercentage = duration > 0 ? (position / duration) * 95 : 0;
  const progressIndex = Math.floor((progressPercentage / 100) * 95);

  const isActive = currentAudioUrl === voiceCard.audioUrl && status === 'playing';

  const waveHeights = useMemo(() =>
    [...Array(waveCount)].map(() => Math.random() * 20 + 5),
    [waveCount]
  );

  return (
    <View style={styles.waveformContainer}>
      {waveHeights.map((height, index) => (
        <View
          key={index}
          style={[
            styles.waveformBar,
            {
              height: isActive ? Math.random() * 20 + 5 : height,
              backgroundColor: isActive && index < progressIndex ? COLORS.red : COLORS.muted
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