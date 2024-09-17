import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import { Provider } from 'react-redux';
import { COLORS } from '@/src/constants/Colors';
import { store } from '@/src/store';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
        {/* <Slot /> */}
      </ThemeProvider>
    </Provider >
  );
}
