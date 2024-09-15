import { configureStore } from '@reduxjs/toolkit';
import voiceCardsReducer from './voice-cards/index';

export const store = configureStore({
  reducer: {
    voiceCards: voiceCardsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;