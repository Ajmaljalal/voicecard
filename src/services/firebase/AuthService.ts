import { createUserWithEmailAndPassword, initializeAuth, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { app } from '../firebase/config';
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


export interface AuthService {
  signUp(email: string, password: string): Promise<UserCredential>;
  signIn(email: string, password: string): Promise<UserCredential>;
  signOut(): Promise<void>;
}

class FirebaseAuthService implements AuthService {
  private get auth() {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    })
  }

  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  signOut() {
    return signOut(this.auth);
  }
}

export default FirebaseAuthService;