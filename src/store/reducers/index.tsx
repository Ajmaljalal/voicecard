import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modal';
import { voiceCardApi } from '../api/VoiceCardApi';


const rootReducer = combineReducers({
  modal: modalReducer,
  [voiceCardApi.reducerPath]: voiceCardApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;