import {
  collection,
  getDocs,
  query,
  orderBy,
  DocumentData,
  doc,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/src/services/firebase/Firestore';
import { VoiceCardRepository } from '@/src/repositories/VoiceCardRepository';
import { FIREBASE_COLLECTION } from '@/src/constants/FirebasCollections';
import { VoiceCard, VoiceCardInput } from '@/src/models/VoiceCard.Model';

export class VoiceCardService implements VoiceCardRepository {
  private collectionRef = collection(db, FIREBASE_COLLECTION.VoiceCards);

  async fetchVoiceCards(): Promise<VoiceCard[]> {
    const q = query(
      this.collectionRef,
      orderBy('createdAt', 'desc'),
      where('parentId', '==', null)
    );
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