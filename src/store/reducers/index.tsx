import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modal';
import appUserReducer from './app-user';
import { voiceCardApi } from '../api/VoiceCardApi';


const rootReducer = combineReducers({
  modal: modalReducer,
  appUser: appUserReducer,
  [voiceCardApi.reducerPath]: voiceCardApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;