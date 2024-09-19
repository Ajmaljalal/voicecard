import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  deleteUser,
  User,
  Auth,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthRepository } from '@/src/repositories/AuthRepository';

class AuthService implements AuthRepository {
  private authInstance = auth;


  async getCurrentUser() {
    return this.authInstance.currentUser;
  }

  async signUp(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.authInstance, email, password);
  }

  async signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(this.authInstance, email, password);
  }

  async signOut() {
    return await signOut(this.authInstance);
  }

  async deleteUser(user: User) {
    return await deleteUser(user);
  }
}

export default AuthService;