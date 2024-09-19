import React from 'react';
import { TouchableOpacity, StyleSheet, } from 'react-native';

import { COLORS } from '../../constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch } from '@/src/store';
import { openModal } from '@/src/store/reducers/modal';
import { ModalName } from '@/src/constants/Modal';
import { useGetCurrentUserQuery } from '@/src/store/api/AuthApi';

const VoiceRecordButton: React.FC = () => {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUserQuery();
  const dispatch = useAppDispatch()

  const openVoiceRecordModal = () => {
    if (!currentUser) {
      dispatch(openModal({ modalName: ModalName.Auth }))
    } else {
      dispatch(openModal({ modalName: ModalName.Record }))
    }
  }

  return (
    <TouchableOpacity onPress={openVoiceRecordModal} style={styles.container}>
      <FontAwesome name="microphone" size={30} color="red" />
    </TouchableOpacity>
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
    height: 100,
  },
});

export default VoiceRecordButton;