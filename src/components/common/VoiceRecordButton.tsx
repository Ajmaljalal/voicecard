import React from 'react';
import { TouchableOpacity, StyleSheet, } from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import { useAppDispatch } from '@/src/store';
import { openModal } from '@/src/store/reducers/modal';
import { ModalName } from '@/src/constants/Modal';
import { useGetCurrentUserQuery } from '@/src/store/api/AuthApi';
import AuthService from '@/src/services/firebase/AuthService';
import { COLORS } from '@/src/constants/Colors';

interface VoiceRecordButtonProps {
  hasBorder?: boolean;
  size: number;
  parentVoiceCardId?: string;
}

const VoiceRecordButton: React.FC<VoiceRecordButtonProps> = ({ size, parentVoiceCardId }) => {
  const { data: currentUser, isLoading: isCurrentUserLoading } = useGetCurrentUserQuery();
  const authUser = new AuthService().getCurrentUser()
  const dispatch = useAppDispatch()
  const isAuth = !!currentUser || !!authUser

  const openVoiceRecordModal = () => {
    if (!isAuth) {
      dispatch(openModal({ modalName: ModalName.Auth }))
    } else {
      dispatch(openModal({ modalName: ModalName.Record, props: { parentVoiceCardId } }))
    }
  }

  return (
    <TouchableOpacity onPress={openVoiceRecordModal} style={styles.container}>
      <FontAwesome name="microphone" size={size} color={COLORS.red} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,

  },
});

export default VoiceRecordButton;