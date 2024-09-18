import { VoiceCard, VoiceCardInput } from '../models/VoiceCard.Model';

export interface VoiceCardRepository {
  fetchVoiceCards(): Promise<VoiceCard[]>;
  addVoiceCard(card: VoiceCardInput): Promise<void>;
}