import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  DocumentData,
  doc,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase/Firestore';
import { VoiceCard, VoiceCardInput } from '@/src/models/VoiceCard';
import { VoiceCardRepository } from './VoiceCardRepository';
import { FIREBASE_COLLECTION } from '../constants/FirebasCollections';

export class FirebaseVoiceCardRepository implements VoiceCardRepository {
  private collectionRef = collection(db, FIREBASE_COLLECTION.VoiceCards);

  async fetchVoiceCards(): Promise<VoiceCard[]> {
    const q = query(this.collectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
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
    const docRef = doc(this.collectionRef);
    await setDoc(docRef, {
      ...card,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    });
  }

}