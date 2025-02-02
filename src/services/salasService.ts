import { api } from './api';
import { Sala } from '../types';

export const salasService = {
  // Listar todos as salas
  listar: async () => {
    const response = await api.get<Sala[]>('/salas');
    return response.data;
  },

  // Obter uma sala específica
  obter: async (id: number) => {
    const response = await api.get<Sala>(`/salas/${id}`);
    return response.data;
  },

  // Criar nova sala
  criar: async (sala: Omit<Sala, 'id'>) => {
    const response = await api.post<Sala>('/salas', sala);
    return response.data;
  },

  // Atualizar sala existente
  atualizar: async (id: number, sala: Partial<Sala>) => {
    const response = await api.put<Sala>(`/salas/${id}`, sala);
    return response.data;
  },

  // Excluir sala
  excluir: async (id: number) => {
    await api.delete(`/salas/${id}`);
  }
};
