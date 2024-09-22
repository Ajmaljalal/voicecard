import React from 'react';
import VoiceCardFeed from '@/src/screens/VoiceCardFeed';
import { useUserLocation } from '@/src/hooks/useLocation';
import LoadingSpinner from '@/src/components/common/LoadingSpinner';
import { Text } from 'react-native';
const HomeScreen: React.FC = () => {
  const { isAddressLoaded } = useUserLocation()

  if (!isAddressLoaded) {
    return <LoadingSpinner />
  }

  return (
    <VoiceCardFeed />
  )
}

export default HomeScreen