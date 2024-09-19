import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants/Colors';
import { useAppDispatch } from '@/src/store';
import { openModal } from '@/src/store/reducers/modal';
import { ModalName } from '@/src/constants/Modal';

const VoiceCardFooter: React.FC<{ parentVoiceCardId: string }> = ({ parentVoiceCardId }) => {
  const dispatch = useAppDispatch();
  const openRecorder = () => {
    dispatch(openModal({ modalName: ModalName.Record, props: { parentVoiceCardId } }));
  };

  return (
    <View style={styles.cardFooter}>
      <TouchableOpacity onPress={openRecorder} style={styles.replyButton}>
        <Ionicons name="mic" size={24} color={COLORS.red} />
      </TouchableOpacity>
      <Ionicons name="trending-up" size={24} color={COLORS.dark} />
    </View>
  );
};

const styles = StyleSheet.create({
  cardFooter: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replyButton: {
    paddingTop: 5,
    width: 30,
    height: 35,
    borderWidth: 0.5,
    borderColor: COLORS.muted,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 3,
    borderBottomLeftRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VoiceCardFooter;
