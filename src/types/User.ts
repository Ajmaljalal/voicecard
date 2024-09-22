export interface AppUser {
  authId?: string;
  username: string;
  email: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
};