import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import { uploadVoiceToFirebase } from '@/src/services/firebase/StorageService';
import { useAddVoiceCardMutation } from '@/src/store/api/VoiceCardApi';
import { VoiceCardInput } from '@/src/models/VoiceCard.Model';
import { useUserLocation } from '@/src/hooks/useLocation';

export const useAudioRecorder = (user: any, parentVoiceCardId: string | null) => {
  const { userAddress } = useUserLocation()
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addVoiceCard] = useAddVoiceCardMutation();

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone for voice recording is required!');
        setIsRecording(false);
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      if (recording && !recording._isDoneRecording) {
        await resumeRecording();
      } else {
        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setRecording(newRecording);
      }
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = async () => {
    if (recording) {
      await recording.pauseAsync();
      setIsPaused(true);
    }
  };

  const resumeRecording = async () => {
    if (recording) {
      await recording.startAsync();
      setIsPaused(false);
    }
  };

  const uploadRecording = async (uri: string, duration: number) => {
    const audioId = `${user.authId}-${Date.now().toString()}`;
    const { audioUrl } = await uploadVoiceToFirebase(uri, audioId);

    const newVoiceCard: VoiceCardInput = {
      parentId: parentVoiceCardId || null,
      author: {
        id: user.authId,
        name: user.username,
      },
      location: userAddress,
      audioDuration: duration,
      audioUrl: `${audioUrl}.m4a`,
      title: 'New Voice Card',
      description: 'This is a new voice card from the voice recorder.',
    };

    await addVoiceCard(newVoiceCard);
  };

  const stopRecording = async () => {
    if (!user || !user.authId) {
      Alert.alert('Oops', 'You need to login first.');
      return false;
    }
    try {
      if (recording) {
        setIsRecording(false);
        setIsPaused(false);
        setIsLoading(true);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (!uri) {
          throw new Error('Recording URI is null');
        }

        const status = await recording.getStatusAsync();
        const duration = status.durationMillis;

        await uploadRecording(uri, duration);

        setIsLoading(false);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        Alert.alert('Recording Saved', 'Your reply has been recorded.');
        return true; // Indicate successful recording
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsRecording(false);
      setIsPaused(false);
      setIsLoading(false);
    }
    return false;
  };

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  return {
    isRecording,
    isPaused,
    isLoading,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  };
};
