import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/reducers';
import AuthModal from './auth';
import { Text } from 'react-native';

import { closeModal } from '../../store/reducers/modal';
import { ModalName } from '@/src/types/modal';
import VoiceRecorder from '../voice-recorder/VoiceRecorder';

const ModalComponents: Record<ModalName, React.FC<any>> = {
  'Auth': AuthModal,
  'Record': VoiceRecorder,
  'Settings': () => <Text>Settings</Text>
};

const ModalMapper: React.FC = () => {
  const dispatch = useDispatch();
  const { currentModal, modalProps } = useSelector((state: RootState) => state.modal);

  if (!currentModal) return null;

  const Model = ModalComponents[currentModal];

  if (!Model) {
    console.warn(`No component found for modal: ${currentModal}`);
    return null;
  }

  const handleClose = () => dispatch(closeModal());

  return <Model visible={true} onClose={handleClose} {...modalProps} />;
};

export default ModalMapper;