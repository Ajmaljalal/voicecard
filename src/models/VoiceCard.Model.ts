import { Address } from "../types/User";


export interface VoiceCard {
  id: string;
  author: {
    id: string;
    name: string;
  };
  location?: Address | null;
  audioUrl: string;
  title: string;
  description: string;
  createdAt?: string;
  audioDuration?: number;
}

export interface VoiceCardInput {
  author: {
    id: string;
    name: string;
  };
  location: Address | null;
  audioUrl: string;
  title?: string;
  description?: string;
  createdAt?: string;
  audioDuration?: number;
  parentId?: string | null;
}