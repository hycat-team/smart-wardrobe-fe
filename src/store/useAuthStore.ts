import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserRes } from '@/features/profile/types';

const MOCK_USERS = {
  free: {
    id: "u1",
    name: "Lê Cẩm Lan",
    username: "lan_style",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
    isPremium: false,
    joinDate: "01/01/2026",
  },
  premium: {
    id: "u_vip",
    name: "VIP Style",
    username: "vip_user",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=VIP",
    isPremium: true,
    joinDate: "15/02/2026",
  },
} as unknown as Record<"free" | "premium", UserRes>;

interface AuthState {
  user: UserRes | null;
  isAuthenticated: boolean;
  setUser: (user: UserRes | null) => void;
  login: (type: "free" | "premium") => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: MOCK_USERS.free,
      isAuthenticated: true,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: (type) => set({ user: MOCK_USERS[type], isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Tên key lưu trong localStorage
    }
  )
);
