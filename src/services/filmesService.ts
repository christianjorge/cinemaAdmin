import { api } from './api';
import { Filme } from '../types';

export const filmesService = {
  // Listar todos os filmes
  listar: async () => {
    const response = await api.get<Filme[]>('/filmes');
    return response.data;
  },

  // Obter um filme específico
  obter: async (id: number) => {
    const response = await api.get<Filme>(`/filmes/${id}`);
    return response.data;
  },

  // Criar novo filme
  criar: async (filme: Omit<Filme, 'id'>) => {
    const response = await api.post<Filme>('/filmes', filme);
    return response.data;
  },

  // Atualizar filme existente
  atualizar: async (id: number, filme: Partial<Filme>) => {
    const response = await api.put<Filme>(`/filmes/${id}`, filme);
    return response.data;
  },

  // Excluir filme
  excluir: async (id: number) => {
    await api.delete(`/filmes/${id}`);
  }
};