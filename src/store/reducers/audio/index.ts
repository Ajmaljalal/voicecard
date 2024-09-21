import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AudioMetadata {
  voiceCardId: string;
  title: string;
  description: string;
  author: string;
}

interface AudioState {
  currentAudioUrl: string | null;
  metadata: AudioMetadata | null;
  isPlaying: boolean;
  position: number;
  duration: number;
}

const initialState: AudioState = {
  currentAudioUrl: null,
  metadata: null,
  isPlaying: false,
  position: 0,
  duration: 0,
};

interface PlayAudioPayload {
  audioUrl: string;
  metadata: AudioMetadata;
}

interface UpdateAudioStatePayload {
  isPlaying?: boolean;
  position?: number;
  duration?: number;
}

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    playAudio(state, action: PayloadAction<PlayAudioPayload>) {
      state.currentAudioUrl = action.payload.audioUrl;
      state.metadata = action.payload.metadata;
      state.isPlaying = true;
      state.position = 0;
      state.duration = 0;
    },
    pauseAudio(state) {
      state.isPlaying = false;
    },
    resumeAudio(state) {
      state.isPlaying = true;
    },
    stopAudio(state) {
      state.currentAudioUrl = null;
      state.metadata = null;
      state.isPlaying = false;
      state.position = 0;
      state.duration = 0;
    },
    updateAudioState(state, action: PayloadAction<UpdateAudioStatePayload>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { playAudio, pauseAudio, resumeAudio, stopAudio, updateAudioState } = audioSlice.actions;
export default audioSlice.reducer;