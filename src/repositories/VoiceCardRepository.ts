import { VoiceCard, VoiceCardInput } from '../models/VoiceCard.Model';

export interface VoiceCardRepository {
  fetchVoiceCards(): Promise<VoiceCard[]>;
  fetchVoiceCardComments(parentId: string): Promise<VoiceCard[]>;
  addVoiceCard(card: VoiceCardInput): Promise<void>;
}