import { AuthRepository } from '@/src/repositories/AuthRepository';
import AuthService from '@/src/services/firebase/AuthService';
import api from './index';
import { RtkQueryTagTypes } from '@/src/constants/RtkQueryTagTeyps';
import { UserRepository } from '@/src/repositories/UserRepository';
import UserService from '@/src/services/firebase/UserService';
import { AppUser } from '@/src/types/User';

const authService: AuthRepository = new AuthService();
const userService: UserRepository = new UserService();

export const authApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    login: builder.mutation<{ success: boolean }, { email: string; password: string }>({
      queryFn: async ({ email, password }) => {
        try {
          await authService.signIn(email, password);
          return { data: { success: true } };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error instanceof Error ? error.message : 'An unknown error occurred'
            }
          };
        }
      },
      invalidatesTags: [{ type: RtkQueryTagTypes.Auth, id: 'AppUser' }],
    }),
    signup: builder.mutation<{ success: boolean }, { user: AppUser }>({
      queryFn: async ({ user }) => {
        const { email, password } = user;
        try {
          const userCredential = await authService.signUp(email, password as string);
          user.authId = userCredential.user.uid;
          delete user.password;
          await userService.registerUser(user);
          return { data: { success: true } };
        } catch (error) {
          return {
            error: {
              status: 'CUSTOM_ERROR',
              data: error instanceof Error ? error.message : 'An unknown error occurred'
            }
          };
        }
      },
      invalidatesTags: [{ type: RtkQueryTagTypes.Auth, id: 'AppUser' }],
    }),
    signOut: builder.mutation<{ success: boolean }, void>({
      queryFn: async () => {
        try {
          await authService.signOut();
          return { data: { success: true } };
        } catch (error) {
          return { error: { status: 'error', data: error } };
        }
      },
      invalidatesTags: [{ type: RtkQueryTagTypes.Auth, id: 'AppUser' }],
    }),
    getCurrentUser: builder.query<AppUser | null, void>({
      queryFn: async () => {
        try {
          const authUser = authService.getCurrentUser();
          if (authUser) {
            const user = await userService.getUser(authUser.uid);
            return { data: user };
          }
          return { data: null };
        } catch (error) {
          return {
            error: {
              status: 'error',
              data: "Error fetching current user"
            }
          };
        }
      },
      providesTags: [{ type: RtkQueryTagTypes.Auth, id: 'AppUser' }],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useSignOutMutation,
  useGetCurrentUserQuery,
} = authApi;
