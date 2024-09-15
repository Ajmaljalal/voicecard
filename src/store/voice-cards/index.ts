import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceCard {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  audioUrl: string;
}

interface VoiceCardsState {
  voiceCards: VoiceCard[];
}

const initialState: VoiceCardsState = {
  voiceCards: [],
};

const voiceCardsSlice = createSlice({
  name: 'voiceCards',
  initialState,
  reducers: {
    setVoiceCards(state, action: PayloadAction<VoiceCard[]>) {
      state.voiceCards = action.payload;
    },
    addVoiceCard(state, action: PayloadAction<VoiceCard>) {
      state.voiceCards.unshift(action.payload);
    },
  },
});

export const { setVoiceCards, addVoiceCard } = voiceCardsSlice.actions;
export default voiceCardsSlice.reducer;