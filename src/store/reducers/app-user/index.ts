import { AppUser } from '@/src/types/User';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppUserState {
  user: AppUser | null;
}

const initialState: AppUserState = {
  user: null,
};

interface AppUserPayload {
  user: AppUser;
}

const appUserSlice = createSlice({
  name: 'appUser',
  initialState,
  reducers: {
    setAppUser(state, action: PayloadAction<AppUserPayload>) {
      state.user = action.payload.user;
    },
    removeAppUser(state) {
      state.user = null;
    },
  },
});

export const { setAppUser, removeAppUser } = appUserSlice.actions;
export default appUserSlice.reducer;