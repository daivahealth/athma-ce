import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeAccessToken, isTokenExpired } from '@/lib/auth/tokens';
import type { AuthSession, JwtClaims } from '@/types/auth';

interface AuthState {
  session: AuthSession;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuthStatus: () => boolean;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: {
        accessToken: null,
        refreshToken: null,
        user: null,
      },
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setSession: (session) => {
        const isAuthenticated = !!(
          session.accessToken && 
          !isTokenExpired(session.accessToken)
        );
        
        set({
          session,
          isAuthenticated,
          error: null,
        });
      },

      clearSession: () => {
        set({
          session: {
            accessToken: null,
            refreshToken: null,
            user: null,
          },
          isAuthenticated: false,
          error: null,
        });
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      checkAuthStatus: () => {
        const { session } = get();
        const isAuthenticated = !!(
          session.accessToken && 
          !isTokenExpired(session.accessToken)
        );
        
        set({ isAuthenticated });
        return isAuthenticated;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
