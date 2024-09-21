import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AudioMetadata {
  voiceCardId: string;
  title: string;
  description: string;
  author: string;
}

type AudioStatus = 'stopped' | 'playing' | 'paused';

interface AudioState {
  currentAudioUrl: string | null;
  metadata: AudioMetadata | null;
  status: AudioStatus;
  position: number;
  duration: number;
}

const initialState: AudioState = {
  currentAudioUrl: null,
  metadata: null,
  status: 'stopped',
  position: 0,
  duration: 0,
};

interface PlayAudioPayload {
  audioUrl: string;
  metadata: AudioMetadata;
}

interface UpdateAudioStatePayload {
  status?: AudioStatus;
  position?: number;
  duration?: number;
}

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    playAudio(state, action: PayloadAction<PlayAudioPayload>) {
      if (state.currentAudioUrl || state.status === 'playing') {
        state.currentAudioUrl = null
        state.metadata = null;
        state.status = 'stopped';
        state.position = 0;
        state.duration = 0;
      }
      state.currentAudioUrl = action.payload.audioUrl;
      state.metadata = action.payload.metadata;
      state.status = 'playing';
      state.position = 0;
      state.duration = 0;
    },
    pauseAudio(state) {
      if (state.status === 'playing') {
        state.status = 'paused';
      }
    },
    resumeAudio(state) {
      if (state.status === 'paused') {
        state.status = 'playing';
      }
    },
    stopAudio(state) {
      state.currentAudioUrl = null;
      state.metadata = null;
      state.status = 'stopped';
      state.position = 0;
      state.duration = 0;
    },
    updateAudioState(state, action: PayloadAction<UpdateAudioStatePayload>) {
      if (action.payload.status) {
        state.status = action.payload.status;
      }
      if (action.payload.position !== undefined) {
        state.position = action.payload.position;
      }
      if (action.payload.duration !== undefined) {
        state.duration = action.payload.duration;
      }
    },
  },
});

export const { playAudio, pauseAudio, resumeAudio, stopAudio, updateAudioState } = audioSlice.actions;
export default audioSlice.reducer;