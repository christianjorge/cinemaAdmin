import { api } from './api';
import { Sessao } from '../types';

export const sessoesService = {
  // Listar todas as sessões
  listar: async () => {
    const response = await api.get<Sessao[]>('/sessoes');
    return response.data;
  },

  // Obter uma sessão específica
  obter: async (id: number) => {
    const response = await api.get<Sessao>(`/sessoes/${id}`);
    return response.data;
  },

  // Criar nova sessão
  criar: async (sessao: Omit<Sessao, 'id'>) => {
    const response = await api.post<Sessao>('/sessoes', sessao);
    return response.data;
  },

  // Atualizar sessão existente
  atualizar: async (id: number, sessao: Partial<Sessao>) => {
    const response = await api.put<Sessao>(`/sessoes/${id}`, sessao);
    return response.data;
  },

  // Excluir sessão
  excluir: async (id: number) => {
    await api.delete(`/sessoes/${id}`);
  }
};