import { configureStore } from '@reduxjs/toolkit';
import { voiceCardApi } from './api/VoiceCardApi';
// import voiceCardsReducer from './reducers/voice-cards';


export const store = configureStore({
  reducer: {
    [voiceCardApi.reducerPath]: voiceCardApi.reducer,
    // voiceCards: voiceCardsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(voiceCardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;