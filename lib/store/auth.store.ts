import { create } from "zustand";
import { authService } from "@/lib/services/auth.service";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  initAuth: async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        set({ loading: false });
        return;
      }

      // 🔥 validar token contra backend
      const user = await authService.me();

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      // token inválido o expirado
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  login: async (email, password) => {
    try {
      set({ loading: true });

      const data = await authService.login(email, password);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

      return true;
    } catch (error) {
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));