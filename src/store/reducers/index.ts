import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modal';
import appUserReducer from './app-user';
import { voiceCardApi } from '../api/VoiceCardApi';
import audioReducer from './audio';
import locationReducer from './location';

const rootReducer = combineReducers({
  modal: modalReducer,
  appUser: appUserReducer,
  audio: audioReducer,
  location: locationReducer,
  [voiceCardApi.reducerPath]: voiceCardApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;