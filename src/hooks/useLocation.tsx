import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/src/store'; // Adjust the import path as needed
import { loadStoredAddress, fetchUserLocation, clearError } from '@/src/store/reducers/location';

export const useUserLocation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const locationState = useSelector((state: RootState) => state.rootReducer.location);

  const initializeLocation = useCallback(() => {
    dispatch(loadStoredAddress());
  }, [dispatch]);

  useEffect(() => {
    if (locationState.isAddressLoaded && !locationState.userAddress) {
      dispatch(fetchUserLocation());
    }
  }, [locationState.isAddressLoaded, locationState.userAddress, dispatch]);

  const retryFetchLocation = useCallback(() => {
    dispatch(clearError());
    dispatch(fetchUserLocation());
  }, [dispatch]);

  return {
    ...locationState,
    retryFetchLocation,
    initializeLocation,
  };
};