import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserAddress } from '@/src/helpers/user';
import { Address } from '@/src/types/User';
import { RootState } from '..';

interface UserLocation {
  latitude: number | null;
  longitude: number | null;
}

interface LocationState {
  userLocation: UserLocation;
  userAddress: Address | null;
  error: string | null;
  isAddressLoaded: boolean;
}

const initialState: LocationState = {
  userLocation: { latitude: null, longitude: null },
  userAddress: null,
  error: null,
  isAddressLoaded: false,
};

export const loadStoredAddress = createAsyncThunk(
  'location/loadStoredAddress',
  async (_, { getState }) => {
    const state = getState() as RootState;
    if (state.location.userAddress) {
      // If we already have an address, don't load from storage
      return null;
    }
    const address = await AsyncStorage.getItem('user_address');
    return address ? JSON.parse(address) : null;
  }
);

export const fetchUserLocation = createAsyncThunk(
  'location/fetchUserLocation',
  async (_, { rejectWithValue }) => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return rejectWithValue('Permission to access location was denied');
    }

    const location = await Location.getCurrentPositionAsync();
    const { latitude, longitude } = location.coords;

    if (latitude && longitude) {
      const address = await getUserAddress(latitude, longitude);
      if (address) {
        await AsyncStorage.setItem('user_address', JSON.stringify(address));
      }
      return { location: { latitude, longitude }, address };
    }

    return { location: { latitude, longitude }, address: null };
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredAddress.fulfilled, (state, action) => {
        if (action.payload) {
          state.userAddress = action.payload;
        }
        state.isAddressLoaded = true;
      })
      .addCase(loadStoredAddress.rejected, (state) => {
        state.error = 'Error getting user address';
        state.isAddressLoaded = true;
      })
      .addCase(fetchUserLocation.fulfilled, (state, action) => {
        state.userLocation = action.payload.location;
        state.userAddress = action.payload.address;
        state.error = null;
      })
      .addCase(fetchUserLocation.rejected, (state, action) => {
        state.error = action.payload as string || 'Error getting user location';
      });
  },
});

export const { clearError } = locationSlice.actions;
export default locationSlice.reducer;