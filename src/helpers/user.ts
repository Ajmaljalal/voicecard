import { UserCredential } from 'firebase/auth';
import { AppUser } from '../types/User';


export const serializeAppUser = (
  {
    credential,
    userDoc
  }: {
    credential: UserCredential,
    userDoc: any
  }): AppUser => {
  return {
    authId: credential.user.uid,
    email: credential.user.email,
    ...userDoc
  };
}
