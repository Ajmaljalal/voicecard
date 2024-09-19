import { AppUser } from "../types/User";

export interface UserRepository {
  registerUser(user: AppUser): Promise<AppUser>;
  updateUser(user: AppUser): Promise<AppUser>;
  getUser(userId: string): Promise<AppUser>;
  deleteUser(userId: string): Promise<void>;
}