import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/Colors';
import { useDispatch } from 'react-redux';
import { addVoiceCard } from '@/src/store/reducers/voice-cards';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dispatch = useDispatch();

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
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        setIsPaused(false);
        // For demonstration, create a dummy VoiceCard
        const newVoiceCard = {
          id: Date.now().toString(),
          author: 'You',
          location: 'Sacramento, CA',
          timestamp: 'Just now',
          audioUrl: uri || '',
          title: 'New Voice Card',
          description: 'New Voice Card Description',
        };
        dispatch(addVoiceCard(newVoiceCard));
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
        });
        Alert.alert('Recording Saved', 'Your voice message has been recorded.');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barAnimations = useRef(Array(20).fill(0).map(() => new Animated.Value(0))).current;

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
    <View style={styles.container}>
      <View style={styles.waveContainer}>
        {/* {renderBars()} */}
      </View>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
        >
          {isRecording ? (
            <FontAwesome name="stop" size={30} color="red" />
          ) : (
            <FontAwesome name="microphone" size={30} color="red" />
          )}
        </TouchableOpacity>
      </Animated.View>
      {isRecording && (
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={isPaused ? resumeRecording : pauseRecording}
            style={[styles.button, isPaused ? styles.stopButton : styles.recordButton]}
          >
            {isPaused ? <FontAwesome name="play" size={30} color={COLORS.dark} /> : <FontAwesome name="pause" size={30} color={COLORS.dark} />}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    flexDirection: 'row',
    gap: 10,
    backgroundColor: COLORS.background,
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    borderWidth: 0.5,
    borderColor: COLORS.dark,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
  },
  stopButton: {
    // backgroundColor: COLORS.red,
  },
  pauseButton: {
    backgroundColor: COLORS.muted,
  },
  resumeButton: {
    backgroundColor: COLORS.muted,
  },
  waveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    width: 200,
    height: 100,
  },
  bar: {
    width: 1,
    height: 100,
    backgroundColor: COLORS.dark,
    opacity: 1,
  },
});

export default VoiceRecorder;