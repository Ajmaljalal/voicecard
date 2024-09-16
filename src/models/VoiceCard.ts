
export interface VoiceCard {
  id: string;
  author: string;
  location?: string;
  createdAt: string;
  audioUrl: string;
  title: string;
  description: string;
}

export interface VoiceCardInput {
  author: string;
  location?: string;
  audioUrl: string;
  title?: string;
  description?: string;
}