import { api } from './api';
import { Venda, VendaRequest, ItemVendaRequest } from '../types/vendas';

export const vendasApi = {
  // Vendas
  listarVendas: async () => {
    const response = await api.get<Venda[]>('/vendas');
    return response.data;
  },

  obterVenda: async (id: number) => {
    const response = await api.get<Venda>(`/vendas/${id}`);
    return response.data;
  },

  criarVenda: async (venda: VendaRequest) => {
    const response = await api.post<Venda>('/vendas', venda);
    return response.data;
  },

  atualizarVenda: async (id: number, venda: VendaRequest) => {
    const response = await api.put<Venda>(`/vendas/${id}`, venda);
    return response.data;
  },

  excluirVenda: async (id: number) => {
    await api.delete(`/vendas/${id}`);
  },

  // Itens da Venda
  listarItensVenda: async (vendaId: number) => {
    const response = await api.get(`/vendas/${vendaId}/itens`);
    return response.data;
  },

  obterItemVenda: async (vendaId: number, itemId: number) => {
    const response = await api.get(`/vendas/${vendaId}/itens/${itemId}`);
    return response.data;
  },

  atualizarItemVenda: async (vendaId: number, itemId: number, item: ItemVendaRequest) => {
    const response = await api.put(`/vendas/${vendaId}/itens/${itemId}`, item);
    return response.data;
  },

  excluirItemVenda: async (vendaId: number, itemId: number) => {
    await api.delete(`/vendas/${vendaId}/itens/${itemId}`);
  },
};