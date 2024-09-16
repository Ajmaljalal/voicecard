import { VoiceCard, VoiceCardInput } from '@/src/models/VoiceCard';
import { VoiceCardRepository } from '@/src/repositories/VoiceCardRepository';
import { FirebaseVoiceCardRepository } from '@/src/repositories/FirebaseVoiceCardRepository';
import api from './index';
import { RtkQueryTagTypes } from '@/src/constants/RtkQueryTagTeyps';

const voiceCardRepository: VoiceCardRepository = new FirebaseVoiceCardRepository();

export const voiceCardApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVoiceCards: builder.query<VoiceCard[], void>({
      queryFn: async () => {
        try {
          const voiceCards = await voiceCardRepository.fetchVoiceCards();
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
    addVoiceCard: builder.mutation<void, VoiceCardInput>({
      queryFn: async (voiceCard) => {
        try {
          await voiceCardRepository.addVoiceCard(voiceCard);
          return { data: undefined };
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