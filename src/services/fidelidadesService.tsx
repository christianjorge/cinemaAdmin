import { api } from './api';
import { Fidelidade } from '../types';

export const fidelidadesService = {
  // Listar todas as fidelidades
  listar: async () => {
    const response = await api.get<Fidelidade[]>('/fidelidades');
    return response.data;
  },

  // Obter uma fidelidade específica
  obter: async (id: number) => {
    const response = await api.get<Fidelidade>(`/fidelidades/${id}`);
    return response.data;
  },

  // Criar nova fidelidade
  criar: async (fidelidade: Omit<Fidelidade, 'id'>) => {
    const response = await api.post<Fidelidade>('/fidelidades', fidelidade);
    return response.data;
  },

  // Atualizar fidelidade existente
  atualizar: async (id: number, fidelidade: Partial<Fidelidade>) => {
    const response = await api.put<Fidelidade>(`/fidelidades/${id}`, fidelidade);
    return response.data;
  },

  // Excluir fidelidade
  excluir: async (id: number) => {
    await api.delete(`/fidelidades/${id}`);
  }
};