import { create } from 'zustand';
import { Usuario } from '../types';

type AuthStore = {
  usuario: Usuario | null;
  token: string | null;
  setAuth: (usuario: Usuario, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  token: null,
  setAuth: (usuario, token) => {
    localStorage.setItem('cinema:token', token);
    set({ usuario, token });
  },
  logout: () => {
    localStorage.removeItem('cinema:token');
    set({ usuario: null, token: null });
  },
}));