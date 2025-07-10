
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;
}

// Default admin credentials (in production, this would come from a backend)
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: 'pharmacy123',
  user: {
    id: '1',
    username: 'admin',
    name: 'Pharmacy Admin',
    role: 'admin' as const
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        // Simple authentication - in production, this would call an API
        if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
          set({
            user: DEFAULT_CREDENTIALS.user,
            isAuthenticated: true
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },

      initializeAuth: () => {
        const state = get();
        if (state.user) {
          set({ isAuthenticated: true });
        }
      }
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeAuth();
        }
      },
    }
  )
);
