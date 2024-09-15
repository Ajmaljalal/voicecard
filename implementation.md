# VoiceCard Frontend Implementation Plan with Expo Router, Redux Toolkit, and React Query

## Overview

This implementation plan outlines the steps to develop the **VoiceCard** frontend using **React Native**, **Expo**, **Expo Router**, **Redux Toolkit (RTK)**, and **React Query (RTQ)**. The focus is on building a scalable, maintainable, and well-structured application with dummy data to demonstrate functionality. Key components include the VoiceCard Feed, VoiceCard Detail, Profile Screen, and associated services.

## Table of Contents

1. [Project Setup](#1-project-setup)
2. [Directory Structure](#2-directory-structure)
3. [Setting Up Constants](#3-setting-up-constants)
4. [Configuring Redux Toolkit](#4-configuring-redux-toolkit)
5. [Implementing React Query](#5-implementing-react-query)
6. [Implementing Components](#6-implementing-components)
    - [VoiceCardFeedScreen](#voicecardfeedscreen)
    - [VoiceCardComponent](#voicecardcomponent)
    - [VoicePlayer](#voiceplayer)
    - [VoiceRecorder](#voicerecorder)
    - [ProfileScreen](#profilescreen)
7. [Styling Components](#7-styling-components)
8. [Dummy Data Integration](#8-dummy-data-integration)
9. [Navigation Setup with Expo Router](#9-navigation-setup-with-expo-router)
10. [Finalizing the Frontend](#10-finalizing-the-frontend)

---

## 1. Project Setup

### Step 1.1: Initialize Expo Project with Expo Router

Start by creating a new Expo project using the Expo CLI with TypeScript support.

```bash
npx create-expo-app voicecard-app --template expo-template-blank-typescript
cd voicecard-app
```

### Step 1.2: Install Dependencies

Install the necessary dependencies for Expo Router, Redux Toolkit, React Query, and other utilities.

```bash
# Expo Router
npx expo install expo-router react-native-screens react-native-safe-area-context

# Redux Toolkit and React-Redux
npm install @reduxjs/toolkit react-redux

# React Query
npm install @tanstack/react-query

# Axios for API calls
npm install axios

# Expo AV for audio handling
npx expo install expo-av

# Other dependencies
npm install
```

### Step 1.3: Configure TypeScript

Ensure TypeScript is set up properly. If not, initialize it:

```bash
npx tsc --init
```

Rename `App.js` to `App.tsx` and adjust the import paths accordingly.

---

## 2. Directory Structure

Organize the project files for scalability and maintainability.

```plaintext
voicecard-app/
├── assets/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── detail/
│   │   └── [id].tsx
│   └── profile/
│       └── index.tsx
├── src/
│   ├── components/
│   │   ├── VoiceCard.tsx
│   │   ├── VoicePlayer.tsx
│   │   └── VoiceRecorder.tsx
│   ├── constants/
│   │   └── colors.ts
│   ├── store/
│   │   ├── index.ts
│   │   └── voiceCardsSlice.ts
│   ├── services/
│   │   └── api.ts
│   ├── hooks/
│   │   └── useVoiceCards.ts
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Setting Up Constants

Create a centralized place for constant values like colors to ensure consistency.

```typescript:src/constants/colors.ts
export const COLORS = {
  primary: '#4A90E2',
  secondary: '#50E3C2',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#333333',
  muted: '#888888',
  error: '#FF3B30',
};
```

---

## 4. Configuring Redux Toolkit

Set up Redux Toolkit for state management.

### 4.1. Create the Redux Store

```typescript:src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import voiceCardsReducer from './voiceCardsSlice';

export const store = configureStore({
  reducer: {
    voiceCards: voiceCardsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4.2. Create the VoiceCards Slice

```typescript:src/store/voiceCardsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VoiceCard {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  audioUrl: string;
}

interface VoiceCardsState {
  voiceCards: VoiceCard[];
}

const initialState: VoiceCardsState = {
  voiceCards: [],
};

const voiceCardsSlice = createSlice({
  name: 'voiceCards',
  initialState,
  reducers: {
    setVoiceCards(state, action: PayloadAction<VoiceCard[]>) {
      state.voiceCards = action.payload;
    },
    addVoiceCard(state, action: PayloadAction<VoiceCard>) {
      state.voiceCards.unshift(action.payload);
    },
  },
});

export const { setVoiceCards, addVoiceCard } = voiceCardsSlice.actions;
export default voiceCardsSlice.reducer;
```

### 4.3. Provide the Redux Store to the App

```typescript:src/app/_layout.tsx
import React from 'react';
import { Slot } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    </Provider>
  );
}
```

---

## 5. Implementing React Query

Configure React Query for data fetching and caching.

### 5.1. Creating a Custom Hook for VoiceCards

```typescript:src/hooks/useVoiceCards.ts
import { useQuery } from '@tanstack/react-query';
import { fetchVoiceCards } from '../services/api';

export const useVoiceCards = () => {
  return useQuery(['voiceCards'], fetchVoiceCards, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    onSuccess: (data) => {
      // Optionally dispatch to Redux store
    },
  });
};
```

### 5.2. Implementing API Service

```typescript:src/services/api.ts
import axios from 'axios';

const API_URL = 'https://api.example.com'; // Replace with actual API endpoint

export const fetchVoiceCards = async () => {
  // For now, return dummy data
  return [
    {
      id: '1',
      author: 'Max Bieber',
      location: 'Los Angeles, CA',
      timestamp: '2h ago',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
    {
      id: '2',
      author: 'Natomas High School',
      location: 'Sacramento, CA',
      timestamp: '1h ago',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: '3',
      author: 'Elon Musk',
      location: 'Palo Alto, CA',
      timestamp: '30m ago',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ];
};
```

---

## 6. Implementing Components

### 6.1. VoiceCardFeedScreen

This screen displays a list of VoiceCards.

```typescript:app/index.tsx
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import VoiceCard from '../src/components/VoiceCard';
import { useVoiceCards } from '../src/hooks/useVoiceCards';
import { useDispatch } from 'react-redux';
import { setVoiceCards } from '../src/store/voiceCardsSlice';
import VoiceRecorder from '../src/components/VoiceRecorder';
import { COLORS } from '../src/constants/colors';

const FeedScreen: React.FC = () => {
  const { data, isLoading, error } = useVoiceCards();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setVoiceCards(data));
    }
  }, [data]);

  const renderItem = ({ item }: { item: any }) => (
    <VoiceCard
      id={item.id}
      author={item.author}
      location={item.location}
      timestamp={item.timestamp}
      audioUrl={item.audioUrl}
    />
  );

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: COLORS.error }}>Failed to load VoiceCards.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VoiceRecorder />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeedScreen;
```

### 6.2. VoiceCard Component

Represents an individual VoiceCard.

```typescript:src/components/VoiceCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import VoicePlayer from './VoicePlayer';
import { COLORS } from '../constants/colors';
import { useRouter } from 'expo-router';

interface VoiceCardProps {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  audioUrl: string;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ id, author, location, timestamp, audioUrl }) => {
  const router = useRouter();

  const handleReply = () => {
    router.push(`/detail/${id}`);
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.location}>{location}</Text>
      <VoicePlayer audioUrl={audioUrl} />
      <Text style={styles.timestamp}>{timestamp}</Text>
      <TouchableOpacity onPress={handleReply} style={styles.replyButton}>
        <Text style={styles.replyText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: COLORS.muted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  location: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
  },
  replyButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  replyText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default VoiceCard;
```

### 6.3. VoicePlayer Component

Handles audio playback.

```typescript:src/components/VoicePlayer.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';

interface VoicePlayerProps {
  audioUrl: string;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    }
  };

  return (
    <View style={styles.playerContainer}>
      <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
        <Text style={styles.playText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  playButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 4,
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default VoicePlayer;
```

### 6.4. VoiceRecorder Component

Allows users to record voice messages.

```typescript:src/components/VoiceRecorder.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';
import { useDispatch } from 'react-redux';
import { addVoiceCard } from '../store/voiceCardsSlice';

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        // For demonstration, create a dummy VoiceCard
        const newVoiceCard = {
          id: Date.now().toString(),
          author: 'You',
          location: 'Your Location',
          timestamp: 'Just now',
          audioUrl: uri || '',
        };
        dispatch(addVoiceCard(newVoiceCard));
        Alert.alert('Recording Saved', 'Your voice message has been recorded.');
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default VoiceRecorder;
```

### 6.5. ProfileScreen

Displays user profile information.

```typescript:app/profile/index.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../src/constants/colors';
import { useRouter } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const handleEditProfile = () => {
    // Navigate to Edit Profile Screen (to be implemented)
    Alert.alert('Edit Profile', 'This feature is under development.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>John Doe</Text>
      <Text style={styles.email}>john.doe@example.com</Text>
      <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ProfileScreen;
```

---

## 7. Styling Components

Ensure consistent styling across components by using the `COLORS` constants. Adjust padding, margins, and font sizes to match the desired design.

- **VoiceCard:** White background with shadow, author and location info, play button.
- **VoicePlayer:** Play/Pause button with secondary color.
- **VoiceRecorder:** Record/Stop button with primary/error colors.
- **ProfileScreen:** Centered user info with edit button.

Feel free to enhance styles to improve the user interface and ensure responsiveness across different devices.

---

## 8. Dummy Data Integration

For frontend development purposes, dummy data is used in the `fetchVoiceCards` function within the `api.ts` service. This mock data simulates API responses and allows testing of components without a backend.

You can modify the `fetchVoiceCards` function to return dynamic data as needed.

---

## 9. Navigation Setup with Expo Router

Use **Expo Router** for navigation between different screens.

### 9.1. `_layout.tsx` Configuration

```typescript:app/_layout.tsx
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Layout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#4A90E2' },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="index" options={{ title: 'VoiceCard Feed' }} />
          <Stack.Screen name="detail/[id]" options={{ title: 'VoiceCard Detail' }} />
          <Stack.Screen name="profile/index" options={{ title: 'Profile' }} />
        </Stack>
        <Slot />
      </QueryClientProvider>
    </Provider>
  );
}
```

### 9.2. Home Screen (`index.tsx`)

Already implemented as `app/index.tsx` in the VoiceCardFeedScreen section.

### 9.3. Detail Screen

```typescript:app/detail/[id].tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/colors';
import { useSearchParams } from 'expo-router';

const DetailScreen: React.FC = () => {
  const { id } = useSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>VoiceCard Detail Screen</Text>
      <Text style={styles.text}>VoiceCard ID: {id}</Text>
      {/* Implement further details and replies here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
  },
  text: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 8,
  },
});

export default DetailScreen;
```

### 9.4. Profile Screen

Already implemented as `app/profile/index.tsx` in the ProfileScreen section.

---

## 10. Finalizing the Frontend

### Step 10.1: Testing Components

Run the application to ensure all components render correctly with dummy data.

```bash
npm start
```

Use the Expo Go app on your mobile device or an emulator to view the app.

### Step 10.2: Refining Styles

Adjust styles as needed to enhance the user interface and ensure responsiveness across different devices. Consistent use of the `COLORS` constants ensures a cohesive design.

### Step 10.3: Implementing Navigation Actions

Connect interactive elements to their respective screens.

**Example:** Navigating to the Profile Screen.

```typescript:src/components/VoiceCard.tsx
import { useRouter } from 'expo-router';

// Inside the VoiceCard component
const handleNavigateProfile = () => {
  router.push('/profile/index');
};

<TouchableOpacity onPress={handleNavigateProfile} style={styles.profileButton}>
  <Text style={styles.profileText}>View Profile</Text>
</TouchableOpacity>
```

Ensure all navigation actions are properly linked and function as expected.

### Step 10.4: Enhancing VoiceRecorder Functionality

Currently, the `VoiceRecorder` component adds a new `VoiceCard` with dummy data. Integrate actual audio uploads and API calls when the backend is ready.

```typescript:src/components/VoiceRecorder.tsx
// After obtaining the recording URI
const handleUpload = async (uri: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'voicecard.m4a',
      type: 'audio/m4a',
    });

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Dispatch action to add the new VoiceCard with the server-provided audioUrl
    const newVoiceCard = {
      id: response.data.id,
      author: 'You',
      location: 'Your Location',
      timestamp: 'Just now',
      audioUrl: response.data.audioUrl,
    };
    dispatch(addVoiceCard(newVoiceCard));
    Alert.alert('Recording Uploaded', 'Your voice message has been uploaded successfully.');
  } catch (error) {
    console.error('Upload failed', error);
    Alert.alert('Upload Failed', 'There was an error uploading your voice message.');
  }
};
```

Ensure to handle file uploads and integrate with the backend once it’s available.

---

## Complete Components

### VoiceCard Component

```typescript:src/components/VoiceCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import VoicePlayer from './VoicePlayer';
import { COLORS } from '../constants/colors';
import { useRouter } from 'expo-router';

interface VoiceCardProps {
  id: string;
  author: string;
  location: string;
  timestamp: string;
  audioUrl: string;
}

const VoiceCard: React.FC<VoiceCardProps> = ({ id, author, location, timestamp, audioUrl }) => {
  const router = useRouter();

  const handleReply = () => {
    router.push(`/detail/${id}`);
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.author}>{author}</Text>
      <Text style={styles.location}>{location}</Text>
      <VoicePlayer audioUrl={audioUrl} />
      <Text style={styles.timestamp}>{timestamp}</Text>
      <TouchableOpacity onPress={handleReply} style={styles.replyButton}>
        <Text style={styles.replyText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: COLORS.muted,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  author: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  location: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
  },
  replyButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  replyText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default VoiceCard;
```

### VoicePlayer Component

```typescript:src/components/VoicePlayer.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';

interface VoicePlayerProps {
  audioUrl: string;
}

const VoicePlayer: React.FC<VoicePlayerProps> = ({ audioUrl }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      setIsPlaying(true);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    }
  };

  return (
    <View style={styles.playerContainer}>
      <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
        <Text style={styles.playText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  playButton: {
    backgroundColor: COLORS.secondary,
    padding: 10,
    borderRadius: 4,
  },
  playText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default VoicePlayer;
```

### VoiceRecorder Component

```typescript:src/components/VoiceRecorder.tsx
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { addVoiceCard } from '../store/voiceCardsSlice';

const API_URL = 'https://api.example.com'; // Replace with actual API endpoint

const VoiceRecorder: React.FC = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required!');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const newRecording = new Audio.Recording();
      await newRecording.startAsync();
      setRecording(newRecording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        setIsRecording(false);
        if (uri) {
          await handleUpload(uri);
        }
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const handleUpload = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'voicecard.m4a',
        type: 'audio/m4a',
      });

      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Dispatch action to add the new VoiceCard with the server-provided audioUrl
      const newVoiceCard = {
        id: response.data.id,
        author: 'You',
        location: 'Your Location',
        timestamp: 'Just now',
        audioUrl: response.data.audioUrl,
      };
      dispatch(addVoiceCard(newVoiceCard));
      Alert.alert('Recording Uploaded', 'Your voice message has been uploaded successfully.');
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload Failed', 'There was an error uploading your voice message.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        style={[styles.button, isRecording ? styles.stopButton : styles.recordButton]}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  recordButton: {
    backgroundColor: COLORS.primary,
  },
  stopButton: {
    backgroundColor: COLORS.error,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default VoiceRecorder;
```

---

## Conclusion

This implementation plan provides a comprehensive guide to building the **VoiceCard** frontend using **React Native**, **Expo**, **Expo Router**, **Redux Toolkit**, and **React Query**. By following this structured approach, you can develop a user-friendly and scalable application. Future steps will involve integrating backend services, enhancing features, and optimizing performance.

Feel free to reach out for assistance with backend implementation or further enhancements!