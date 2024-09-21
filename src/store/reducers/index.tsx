import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modal';
import appUserReducer from './app-user';
import { voiceCardApi } from '../api/VoiceCardApi';
import audioReducer from './audio';


const rootReducer = combineReducers({
  modal: modalReducer,
  appUser: appUserReducer,
  audio: audioReducer,
  [voiceCardApi.reducerPath]: voiceCardApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;