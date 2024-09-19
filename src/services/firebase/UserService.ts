import { UserRepository } from "@/src/repositories/UserRepository";
import { AppUser } from "@/src/types/User";
import { db } from "./Firestore";
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

class UserService implements UserRepository {
  private usersCollection = collection(db, 'users');

  async registerUser(user: AppUser) {
    const userDoc = doc(this.usersCollection, user.authId);
    const userDocSnapshot = await getDoc(userDoc);
    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data() as AppUser;
    }
    const newUser = {
      ...user,
      authId: userDoc.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await setDoc(userDoc, newUser);
    return newUser;
  }

  async updateUser(user: AppUser) {
    const userDoc = doc(this.usersCollection, user.authId);
    await updateDoc(userDoc, {
      ...user,
      updatedAt: new Date().toISOString(),
    });
    return user;
  }

  async getUser(userId: string): Promise<AppUser> {
    const userDoc = doc(this.usersCollection, userId);
    const userDocSnapshot = await getDoc(userDoc);
    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data() as AppUser;
    }
    throw new Error(`User with ID ${userId} not found`);
  }

  async deleteUser(userId: string) {
    const userDoc = doc(this.usersCollection, userId);
    await deleteDoc(userDoc);
  }
}

export default UserService;