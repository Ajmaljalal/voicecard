import React, { createContext, useContext, useRef, useEffect, useCallback } from 'react';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { stopAudio, updateAudioState } from '@/src/store/reducers/audio';
import { audioSelector } from '../store/selectors/AudioSelector';
import { useAppDispatch, useAppSelector } from '../store';

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
  const dispatch = useAppDispatch();
  const { currentAudioUrl, status } = useAppSelector(audioSelector);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isInitialLoad = useRef<boolean>(true);

  const onPlaybackStatusUpdate = useCallback(
    (statusObj: AVPlaybackStatus) => {
      if (statusObj.isLoaded) {
        dispatch(updateAudioState({
          status: statusObj.isPlaying ? 'playing' : (statusObj.isBuffering ? 'paused' : 'paused'),
          position: statusObj.positionMillis,
          duration: statusObj.durationMillis || 0,
        }));

        if (statusObj.didJustFinish && !statusObj.isLooping) {
          dispatch(stopAudio());
        }
      } else {
        if (statusObj.error) {
          console.error(`Playback Error: ${statusObj.error}`);
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

  // Effect to handle initial loading and playing of the audio
  useEffect(() => {
    const handleInitialAudioPlayback = async () => {
      if (!currentAudioUrl) {
        // No audio to play, stop any existing sound
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        return;
      }

      await loadSound(currentAudioUrl);

      if (status === 'playing' && soundRef.current) {
        await soundRef.current.playAsync();
      }
    };

    handleInitialAudioPlayback();

    // Cleanup when component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, [currentAudioUrl]);

  // Effect to handle play/pause after the initial load
  useEffect(() => {
    const handlePlayPause = async () => {
      if (!soundRef.current) return;

      const soundStatus = await soundRef.current.getStatusAsync() as AVPlaybackStatusSuccess;

      if (status === 'playing' && !soundStatus.isPlaying) {
        await soundRef.current.playAsync();
      } else if (status === 'paused' && soundStatus.isPlaying) {
        await soundRef.current.pauseAsync();
      }
    };

    // To prevent this effect from running on the initial load
    if (!isInitialLoad.current) {
      handlePlayPause();
    } else {
      isInitialLoad.current = false;
    }
  }, [status]);

  return (
    <AudioContext.Provider value={{}}>
      {children}
    </AudioContext.Provider>
  );
};


