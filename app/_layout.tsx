import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { Provider } from 'react-redux';
import { COLORS } from '@/src/constants/Colors';
import { store } from '@/src/store';
import ModalMapper from '@/src/components/modals';


export default function RootLayout() {

  return (
    <Provider store={store}>
      <Stack
        initialRouteName='index'
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.dark,
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Inter-Bold',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Voice Cards' }} />
        <Stack.Screen name="voicecard-detail/[id]" options={{ headerTitle: '' }} />
        <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
      </Stack>
      <ModalMapper />
    </Provider >
  );
}
