import { ModalName } from '@/src/types/modal';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  currentModal: ModalName | null;
  modalProps: Record<string, any>;
}

const initialState: ModalState = {
  currentModal: null,
  modalProps: {},
};

interface OpenModalPayload {
  modalName: ModalName;
  props?: Record<string, any>;
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<OpenModalPayload>) {
      state.currentModal = action.payload.modalName;
      state.modalProps = action.payload.props || {};
    },
    closeModal(state) {
      state.currentModal = null;
      state.modalProps = {};
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;