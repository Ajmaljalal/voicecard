// src/store/voiceCardApi.ts
import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { VoiceCard, VoiceCardInput } from '@/src/models/VoiceCard';
import { VoiceCardRepository } from '@/src/repositories/VoiceCardRepository';
import { FirebaseVoiceCardRepository } from '@/src/repositories/FirebaseVoiceCardRepository';

// Instantiate the repository
const voiceCardRepository: VoiceCardRepository = new FirebaseVoiceCardRepository();

// Create a base query function that uses the repository
const baseQuery: BaseQueryFn<
  { method: string; data?: any },
  unknown,
  unknown
> = async ({ method, data }) => {
  try {
    switch (method) {
      case 'fetchVoiceCards':
        const voiceCards = await voiceCardRepository.fetchVoiceCards();

        return { data: voiceCards };
      case 'addVoiceCard':
        await voiceCardRepository.addVoiceCard(data);
        return { data: null };
      // Handle other methods if needed
      default:
        throw new Error('Method not implemented');
    }
  } catch (error) {
    return { error };
  }
};

export const voiceCardApi = createApi({
  reducerPath: 'voiceCardApi',
  baseQuery,
  tagTypes: ['VoiceCards'],
  endpoints: (builder) => ({
    getVoiceCards: builder.query<VoiceCard[], void>({
      query: () => ({ method: 'fetchVoiceCards' }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'VoiceCards' as const, id })),
            { type: 'VoiceCards', id: 'LIST' },
          ]
          : [{ type: 'VoiceCards', id: 'LIST' }],
    }),
    addVoiceCard: builder.mutation<void, VoiceCardInput>({
      query: (voiceCard) => ({ method: 'addVoiceCard', data: voiceCard }),
      invalidatesTags: [{ type: 'VoiceCards', id: 'LIST' }],
    }),
    // Add other endpoints as needed
  }),
});

export const { useGetVoiceCardsQuery, useAddVoiceCardMutation } = voiceCardApi;