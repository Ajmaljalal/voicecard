import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import { stopAudio, updateAudioState } from '@/src/store/reducers/audio';
import { audioSelector } from '../store/selectors/AudioSelector';

interface AudioContextProps {
  // The context can expose additional functionalities if needed
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const useAudioContext = (): AudioContextProps => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentAudioUrl, isPlaying } = useSelector(audioSelector);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isInitialMount = useRef(true);

  const onPlaybackStatusUpdate = useCallback(
    (status: AVPlaybackStatus) => {
      if (status.isLoaded) {
        dispatch(updateAudioState({
          isPlaying: status.isPlaying,
          position: status.positionMillis,
          duration: status.durationMillis || 0,
        }));

        if (status.didJustFinish && !status.isLooping) {
          dispatch(stopAudio());
        }
      } else {
        if (status.error) {
          console.error(`Playback Error: ${status.error}`);
          dispatch(stopAudio());
        }
      }
    },
    [dispatch]
  );

  const loadSound = useCallback(async (audioUrl: string) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    soundRef.current = sound;
  }, [onPlaybackStatusUpdate]);

  // Effect to handle playing/resuming/stopping based on Redux state
  useEffect(() => {
    const handleAudioPlayback = async () => {

      if (!currentAudioUrl) {
        // No audio to play, stop any existing sound
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        return;
      }

      if (isInitialMount.current) {
        isInitialMount.current = false;
        // Initial mount, load the sound if necessary
        if (!soundRef.current || (soundRef.current && currentAudioUrl !== ((await soundRef.current.getStatusAsync()) as AVPlaybackStatusSuccess).uri)) {
          await loadSound(currentAudioUrl);
        }

        if (isPlaying && soundRef.current) {
          await (soundRef.current as Audio.Sound).playAsync();
        }
        return;
      }

      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();

        if (isPlaying && status.isLoaded && !('error' in status) && !status.isPlaying) {
          await (soundRef.current as Audio.Sound).playAsync();
        } else if (!isPlaying && status.isLoaded && !('error' in status) && status.isPlaying) {
          await soundRef.current.pauseAsync();
        }
      } else {
        // If no sound is loaded, load and play
        await loadSound(currentAudioUrl);
        if (isPlaying && soundRef.current) {
          await (soundRef.current as Audio.Sound).playAsync();
        }
      }
    };

    handleAudioPlayback();

    // Cleanup when component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [currentAudioUrl]);

  return (
    <AudioContext.Provider value={{}}>
      {children}
    </AudioContext.Provider>
  );
};


