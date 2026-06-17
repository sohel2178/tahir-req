import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "user";
  contact?: string;
  organization_name?: string;
  address?: string;
  image?: string;
  token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      login: async (email, password) => {
        try {
          const res = await axios.post(`${API_URL}/users/login`, { email, password });
          set({ user: res.data.user, token: res.data.token });
          return true;
        } catch (err) {
          console.error("Login failed:", err);
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
