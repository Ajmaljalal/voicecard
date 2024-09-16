import { VoiceCard, VoiceCardInput } from '../models/VoiceCard';

export interface VoiceCardRepository {
  fetchVoiceCards(): Promise<VoiceCard[]>;
  addVoiceCard(card: VoiceCardInput): Promise<void>;
}