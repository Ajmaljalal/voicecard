import DetailScreen from "@/src/screens/VoiceCardDetails";
import { useLocalSearchParams } from "expo-router";
import { voiceCardApi } from "@/src/store/api/VoiceCardApi";
import { VoiceCardProps } from "@/src/components/VoiceCard";

const VoiceCardDetail = () => {
  const { id } = useLocalSearchParams();
  const { data: voiceCards, isLoading, isError } = voiceCardApi.useGetVoiceCardsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading voice cards</div>;
  }

  const voiceCard = voiceCards?.find(card => card.id === id) as unknown as VoiceCardProps

  if (!voiceCard) {
    return <div>Voice card not found</div>;
  }

  return <DetailScreen voiceCard={voiceCard} />
}

export default VoiceCardDetail;