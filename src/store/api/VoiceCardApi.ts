import { VoiceCard, VoiceCardInput } from '@/src/models/VoiceCard.Model';
import { VoiceCardRepository } from '@/src/repositories/VoiceCardRepository';
import api from './index';
import { RtkQueryTagTypes } from '@/src/constants/RtkQueryTagTeyps';
import { VoiceCardService } from '@/src/services/firebase/VoiceCardService';

const voiceCardService: VoiceCardRepository = new VoiceCardService();

export const voiceCardApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVoiceCards: builder.query<VoiceCard[], void>({
      queryFn: async () => {
        try {
          const voiceCards = await voiceCardService.fetchVoiceCards();
          return { data: voiceCards };
        } catch (error) {
          return { error: { status: 'errorr', data: error } };
        }
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: RtkQueryTagTypes.VoiceCards, id })),
            { type: RtkQueryTagTypes.VoiceCards, id: 'VoiceCardsList' },
          ]
          : [{ type: RtkQueryTagTypes.VoiceCards, id: 'VoiceCardsList' }],
    }),
    addVoiceCard: builder.mutation<string, VoiceCardInput>({
      queryFn: async (voiceCard) => {
        try {
          await voiceCardService.addVoiceCard(voiceCard);
          return { data: 'success' };
        } catch (error) {
          return { error: { status: 'error', data: error } };
        }
      },
      invalidatesTags: [{ type: RtkQueryTagTypes.VoiceCards, id: 'VoiceCardsList' }],
    }),
  }),
});

export const {
  useGetVoiceCardsQuery,
  useAddVoiceCardMutation,
} = voiceCardApi;