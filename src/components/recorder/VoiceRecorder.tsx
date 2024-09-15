import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import { addVoiceCard } from '@/src/store/voice-cards';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        // For demonstration, create a dummy VoiceCard
        const newVoiceCard = {
          id: Date.now().toString(),
          author: 'You',
          location: 'Your Location',
          timestamp: 'Just now',
          audioUrl: uri || '',
        };
        dispatch(addVoiceCard(newVoiceCard));
        Alert.alert('Recording Saved', 'Your voice message has been recorded.');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
      >
        {isRecording ? (
          <FontAwesome name="pause" size={30} color="#FFFFFF" />
        ) : (
          <FontAwesome name="microphone" size={30} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    backgroundColor: COLORS.primary,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
});

export default VoiceRecorder;