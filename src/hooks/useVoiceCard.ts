import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVoiceCards } from "../services/api.voiceCard";
import { RootState } from "../store/store";
import { setVoiceCards } from "../store/voice-cards";

export const useVoiceCards = () => {
  const dispatch = useDispatch();
  const voiceCards = useSelector((state: RootState) => state.voiceCards.voiceCards);

  useEffect(() => {
    const data = fetchVoiceCards();
    dispatch(setVoiceCards(data));
  }, [dispatch]);

  return { voiceCards };
};