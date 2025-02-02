import { api } from './api';
import { Produto } from '../types';

export const produtosService = {
  // Listar todos os produtos
  listar: async () => {
    const response = await api.get<Produto[]>('/produtos');
    return response.data;
  },

  // Obter um produto específico
  obter: async (id: number) => {
    const response = await api.get<Produto>(`/produtos/${id}`);
    return response.data;
  },

  // Criar novo produto
  criar: async (produto: Omit<Produto, 'id'>) => {
    const response = await api.post<Produto>('/produtos', produto);
    return response.data;
  },

  // Atualizar produto existente
  atualizar: async (id: number, produto: Partial<Produto>) => {
    const response = await api.put<Produto>(`/produtos/${id}`, produto);
    return response.data;
  },

  // Excluir produto
  excluir: async (id: number) => {
    await api.delete(`/produtos/${id}`);
  }
};
