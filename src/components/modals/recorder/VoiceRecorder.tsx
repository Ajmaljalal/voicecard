import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../constants/Colors';
import LoadingSpinner from '../../common/LoadingSpinner';
import { useGetCurrentUserQuery } from '@/src/store/api/AuthApi';
import { useAudioRecorder } from '@/src/hooks/useAudioRecorder';

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
  const {
    isRecording,
    isPaused,
    isLoading,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useAudioRecorder(user, parentVoiceCardId);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const barAnimations = useRef(Array(20).fill(0).map(() => new Animated.Value(0))).current;

  const handleStopRecording = async () => {
    const success = await stopRecording();
    if (success) {
      onClose();
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
                  onPress={isRecording ? handleStopRecording : startRecording}
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
