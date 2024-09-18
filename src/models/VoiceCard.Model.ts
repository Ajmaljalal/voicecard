
export interface VoiceCard {
  id: string;
  author: string;
  location?: {
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
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
  location?: {
    city: string;
    state: string;
    country: string;
    zipcode: string;
  }
  audioUrl: string;
  title?: string;
  description?: string;
  createdAt?: string;
  audioDuration?: number;
  parentId?: string;
}