import { api } from './api';
import { Estoque } from '../types';

export const estoqueService = {
  // Listar todos os registros de estoque
  listar: async () => {
    const response = await api.get<Estoque[]>('/estoques');
    return response.data;
  },

  // Obter um registro de estoque específico
  obter: async (id: number) => {
    const response = await api.get<Estoque>(`/estoques/${id}`);
    return response.data;
  },

  // Criar um novo registro de estoque
  criar: async (estoque: Omit<Estoque, 'id'>) => {
    const response = await api.post<Estoque>('/estoques', estoque);
    return response.data;
  },

  // Atualizar um registro de estoque existente
  atualizar: async (id: number, estoque: Partial<Estoque>) => {
    const response = await api.put<Estoque>(`/estoques/${id}`, estoque);
    return response.data;
  },

  // Excluir um registro de estoque
  excluir: async (id: number) => {
    await api.delete(`/estoques/${id}`);
  }
};