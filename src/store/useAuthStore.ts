import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRes } from '@/features/profile/types';

interface AuthState {
  user: UserRes | null;
  isAuthenticated: boolean;
  setUser: (user: UserRes | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Tên key lưu trong localStorage
    }
  )
);
