import { API_ENDPOINTS } from "@/constants/api";
import type { SystemData, User } from "@/types/systemDataTypes";
import api from "@/utils/axios";
import { create } from "zustand";

type State = {
  user: User | null;
  system: SystemData | null;
  loading: boolean;
  fetchSystemData: () => Promise<void>;
};

export const useSystemStore = create<State>((set) => ({
  user: null,
  system: null,
  loading: true,
  fetchSystemData: async () => {
    try {
      const userEndpoint = API_ENDPOINTS.USER.ME;
      const systemEndpoint = API_ENDPOINTS.SYSTEM.INFO;
      const [userRes, systemRes] = await Promise.all([
        api.get(userEndpoint),
        api.get(systemEndpoint),
      ]);

      set({
        user: userRes.data,
        system: systemRes.data,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
