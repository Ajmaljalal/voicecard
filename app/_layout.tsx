import { Stack, useRouter } from 'expo-router';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { useAppDispatch, store } from '@/src/store';
import { COLORS } from '@/src/constants/Colors';
import ModalMapper from '@/src/components/modals';
import { TouchableOpacity } from 'react-native';
import { useGetCurrentUserQuery, useSignOutMutation } from '@/src/store/api/AuthApi';
import { Ionicons } from '@expo/vector-icons';
import { ModalName } from '@/src/constants/Modal';
import { openModal } from '@/src/store/reducers/modal';
import { useEffect, useState } from 'react';
import AuthService from '@/src/services/firebase/AuthService';
import { auth } from '@/src/services/firebase/config';
import { AudioProvider } from '@/src/context/AudioContext';
import GlobalAudioPlayer from '@/src/components/common/GlobalAudioPlayer';
import { useUserLocation } from '@/src/hooks/useLocation';
const HeaderButton = ({ iconName, onPress }: { iconName: keyof typeof Ionicons.glyphMap, onPress: () => void }) => (
  <TouchableOpacity onPress={onPress}>
    <Ionicons name={iconName} size={24} color={COLORS.dark} />
  </TouchableOpacity>
);


function StackNavigator() {
  const { initializeLocation } = useUserLocation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signOut] = useSignOutMutation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: user, refetch } = useGetCurrentUserQuery();

  useEffect(() => {
    initializeLocation();
  }, [initializeLocation]);


  useEffect(() => {
    const checkAuthState = async () => {
      const authUser = new AuthService().getCurrentUser();
      setIsLoggedIn(!!authUser);
      if (authUser) {
        refetch();
      }
    };

    checkAuthState();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (user) {
        refetch();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (isLoggedIn) {
      await signOut();
    } else {
      dispatch(openModal({ modalName: ModalName.Auth }));
    }
  };

  const screenOptions = {
    headerStyle: { backgroundColor: COLORS.background },
    headerTintColor: COLORS.dark,
    headerTitleAlign: 'center' as const,
    headerTitleStyle: { fontFamily: 'Inter-Bold' },
  };

  return (
    <AudioProvider>
      <Stack initialRouteName='index' screenOptions={screenOptions}>
        <Stack.Screen
          name="index"
          options={{
            title: 'Voice Cards',
            headerRight: () => <HeaderButton iconName="settings" onPress={() => console.log('settings')} />,
            headerLeft: () => <HeaderButton iconName={isLoggedIn ? "log-out" : "log-in"} onPress={handleAuthAction} />,
          }}
        />
        <Stack.Screen name="voicecard-detail/[id]" options={{
          headerTitle: '',
          headerLeft: () => <HeaderButton iconName="arrow-back" onPress={router.back} />,
        }} />
        <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
      </Stack>
      <ModalMapper />
      <GlobalAudioPlayer />
    </AudioProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <StackNavigator />
    </Provider>
  );
}
