import { UserCredential, User } from "firebase/auth";

export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  signUp(email: string, password: string): Promise<UserCredential>;
  signIn(email: string, password: string): Promise<UserCredential>;
  signOut(): Promise<void>;
  deleteUser(user: User): Promise<void>;
}