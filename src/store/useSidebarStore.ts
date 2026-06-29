import { create } from 'zustand';

interface SidebarState {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  toggleCollapse: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  setIsCollapsed: (isCollapsed) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("closy_sidebar_collapsed", String(isCollapsed));
    }
    set({ isCollapsed });
  },
  toggleCollapse: () => set((state) => {
    const newState = !state.isCollapsed;
    if (typeof window !== 'undefined') {
      localStorage.setItem("closy_sidebar_collapsed", String(newState));
    }
    return { isCollapsed: newState };
  }),
}));
