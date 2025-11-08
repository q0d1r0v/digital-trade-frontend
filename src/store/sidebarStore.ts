import { create } from "zustand";

interface SidebarState {
  isMini: boolean;
  isMobileOpen: boolean;
  activeId: string;
  isMobile: boolean;
  setMini: (mini: boolean) => void;
  setMobileOpen: (open: boolean) => void;
  setActiveId: (id: string) => void;
  setIsMobile: (mobile: boolean) => void;
  toggleMini: () => void;
  toggleMobileOpen: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isMini: false,
  isMobileOpen: false,
  activeId: "",
  isMobile: false,
  setMini: (mini) => set({ isMini: mini }),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
  setActiveId: (id) => set({ activeId: id }),
  setIsMobile: (mobile) => set({ isMobile: mobile }),
  toggleMini: () => set((state) => ({ isMini: !state.isMini })),
  toggleMobileOpen: () =>
    set((state) => ({ isMobileOpen: !state.isMobileOpen })),
}));
