import { fetchVoiceCards } from "../services/api.voiceCard";

export const useVoiceCards = () => {
  const data = fetchVoiceCards();
  return { data };
};