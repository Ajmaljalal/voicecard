import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/Colors';
import LoadingSpinner from '../../common/LoadingSpinner';
import { uploadVoiceToFirebase } from '../../../services/firebase/StorageService';
import { useAddVoiceCardMutation } from '../../../store/api/VoiceCardApi';
import { VoiceCardInput } from '../../../models/VoiceCard.Model';
import { useGetCurrentUserQuery } from '@/src/store/api/AuthApi';

interface VoiceRecorderProps {
  visible: boolean;
  onClose: () => void;
  parentVoiceCardId: string | null;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  visible,
  onClose,
  parentVoiceCardId,
}) => {
  const { data: user } = useGetCurrentUserQuery();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addVoiceCard] = useAddVoiceCardMutation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barAnimations = useRef(Array(20).fill(0).map(() => new Animated.Value(0))).current;

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required!');
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

  const stopRecording = async () => {
    if (!user || !user.authId) {
      Alert.alert('Oops', 'You need to login first.');
      return;
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

        const audioId = `${user.authId}-${Date.now().toString()}`;
        const { audioUrl } = await uploadVoiceToFirebase(uri, audioId);

        // Create a new VoiceCard with the audio URL
        const newVoiceCard: VoiceCardInput = {
          parentId: parentVoiceCardId || null,
          author: {
            id: user.authId,
            name: user.username,
          },
          location: {
            city: 'Sacramento', // TODO: Replace with actual location
            state: 'CA', // TODO: Replace with actual location
            country: 'USA', // TODO: Replace with actual location
            zipcode: '95814',
          },
          audioDuration: duration,
          audioUrl: audioUrl, // Use the URL from Firebase Storage
          title: 'Reply Voice Card',
          description: 'Reply to your voice card.',
        };

        await addVoiceCard(newVoiceCard);
        setIsLoading(false);
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        Alert.alert('Recording Saved', 'Your reply has been recorded.');
        onClose(); // Close the modal after successful upload
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsRecording(false);
      setIsPaused(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let animationLoop: Animated.CompositeAnimation | null = null;

    if (isRecording && !isPaused) {
      animationLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animationLoop.start();
    } else {
      pulseAnim.setValue(1);
    }

    if (isRecording && !isPaused) {
      const animations = barAnimations.map((anim, index) => {
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: Math.random(),
            duration: 100 + index * 50,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 100 + index,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.loop(Animated.stagger(100, animations)).start();
    } else {
      barAnimations.forEach(anim => anim.setValue(0));
    }

    return () => {
      if (animationLoop) {
        animationLoop.stop();
      }
      barAnimations.forEach(anim => anim.stopAnimation());
    };
  }, [isRecording, isPaused, pulseAnim, barAnimations]);

  const renderBars = () => {
    return barAnimations.map((anim, index) => (
      <Animated.View
        key={index}
        style={[
          styles.bar,
          {
            transform: [{
              scaleY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.1, 1],
              })
            }],
          },
        ]}
      />
    ));
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.buttonsContainer}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <Animated.View style={{ transform: [{ scale: pulseAnim }], }}>
                <TouchableOpacity
                  onPress={isRecording ? stopRecording : startRecording}
                  style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
                >
                  {isRecording ? (
                    <FontAwesome name="stop" size={30} color={COLORS.red} />
                  ) : (
                    <FontAwesome name="microphone" size={30} color={COLORS.red} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}
            {isRecording && !isLoading && (
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <TouchableOpacity
                  onPress={isPaused ? resumeRecording : pauseRecording}
                  style={[styles.button, isPaused ? styles.pauseButton : styles.recordButton]}
                >
                  {isPaused ? (
                    <FontAwesome name="play" size={30} color={COLORS.dark} />
                  ) : (
                    <FontAwesome name="pause" size={30} color={COLORS.dark} />
                  )}
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
          {isRecording && !isLoading && (
            <View style={styles.waveContainer}>
              {renderBars()}
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: 300,
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  recordButton: {

  },
  stopButton: {

  },
  pauseButton: {

  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    width: '100%',
    height: 50,
    marginTop: 10,
  },
  bar: {
    width: 2,
    height: 30,
    backgroundColor: COLORS.dark,
    opacity: 1,
    marginHorizontal: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default VoiceRecorder;
