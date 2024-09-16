import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase/Firestore';
import { VoiceCard, VoiceCardInput } from '@/src/models/VoiceCard';
import { VoiceCardRepository } from './VoiceCardRepository';

export class FirebaseVoiceCardRepository implements VoiceCardRepository {
  private collectionRef = collection(db, 'voicecards');

  async fetchVoiceCards(): Promise<VoiceCard[]> {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    console.log('snapshot', snapshot);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      console.log('data from firebase', data);
      return {
        id: doc.id,
        author: data.author,
        location: data.location,
        createdAt: data.createdAt,
        audioUrl: data.audioUrl,
        title: data.title,
        description: data.description,
      } as VoiceCard;
    });
  }

  async addVoiceCard(card: VoiceCardInput): Promise<void> {
    await addDoc(this.collectionRef, {
      ...card,
      timestamp: Timestamp.now(),
    });
  }

}