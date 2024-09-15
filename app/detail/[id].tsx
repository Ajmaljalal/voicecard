import DetailScreen from "@/src/screens/VoiceCardDetails";
import { useLocalSearchParams } from "expo-router";

const VoiceCardDetail = () => {
  const { id } = useLocalSearchParams();
  return <DetailScreen id={id as string} />
}

export default VoiceCardDetail;