import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';

interface AudioPlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
  currentAudioUrl: string | null;
}

interface AudioContextProps extends AudioPlayerState {
  playAudio: (audioUrl: string) => Promise<void>;
  pauseAudio: () => Promise<void>;
  togglePlayback: (audioUrl: string) => Promise<void>;
  stopAudio: () => Promise<void>;
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
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    position: 0,
    duration: 0,
    currentAudioUrl: null,
  });

  const soundRef = useRef<Audio.Sound | null>(null);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setState((prevState) => ({
        ...prevState,
        isPlaying: status.isPlaying,
        position: status.positionMillis,
        duration: status.durationMillis || 0,
      }));

      if (status.didJustFinish) {
        // Reset position when audio finishes
        setState((prevState) => ({
          ...prevState,
          isPlaying: false,
          position: 0,
        }));
      }
    } else {
      if (status.error) {
        console.error(`Playback Error: ${status.error}`);
      }
    }
  };

  const unloadSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      setState((prevState) => ({
        ...prevState,
        isPlaying: false,
        position: 0,
        duration: 0,
        currentAudioUrl: null,
      }));
    }
  };

  const loadSound = async (audioUrl: string) => {
    await unloadSound();
    const { sound } = await Audio.Sound.createAsync(
      { uri: audioUrl },
      { shouldPlay: false },
      onPlaybackStatusUpdate
    );
    soundRef.current = sound;
  };

  const playAudio = async (audioUrl: string) => {
    try {
      if (state.currentAudioUrl !== audioUrl && audioUrl !== null) {
        await loadSound(audioUrl);
        setState((prev) => ({ ...prev, currentAudioUrl: audioUrl, position: 0 }));
      }

      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            // Already playing
            return;
          }
          // Always play from the beginning if the audio has finished
          if (status.didJustFinish || state.position >= state.duration) {
            await soundRef.current.setPositionAsync(0);
            setState((prev) => ({ ...prev, position: 0 }));
            await soundRef.current.playAsync();
          } else {
            // Play from the current position in state
            await soundRef.current.playFromPositionAsync(state.position);
          }
        }
      }
    } catch (error) {
      console.error('Error in playAudio:', error);
    }
  };

  const pauseAudio = async () => {
    try {
      if (soundRef.current) {
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await soundRef.current.pauseAsync();
          // Update the position in the state
          setState((prev) => ({ ...prev, position: status.positionMillis }));
        }
      }
    } catch (error) {
      console.error('Error in pauseAudio:', error);
    }
  };

  const togglePlayback = async (audioUrl: string) => {
    if (state.isPlaying) {
      await pauseAudio();
    } else {
      await playAudio(audioUrl);
    }
  };

  const stopAudio = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        setState({
          isPlaying: false,
          position: 0,
          duration: 0,
          currentAudioUrl: null,
        });
      }
    } catch (error) {
      console.error('Error in stopAudio:', error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      unloadSound();
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        ...state,
        playAudio,
        pauseAudio,
        togglePlayback,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};


