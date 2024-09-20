import { useAudioContext } from '@/src/context/AudioContext';

export const useAudioPlayer = () => {
  const { playAudio, pauseAudio, togglePlayback, isPlaying, position, duration } = useAudioContext();

  const play = (audioUrl: string) => playAudio(audioUrl);
  const pause = () => pauseAudio();
  const toggle = (audioUrl: string) => togglePlayback(audioUrl);

  return {
    isPlaying,
    position,
    duration,
    play,
    pause,
    togglePlayback: toggle,
  };
};
