import { api } from './api';
import { Oferta } from '../types';

export const ofertasService = {
  // Listar todas as ofertas
  listar: async () => {
    const response = await api.get<Oferta[]>('/oferta');
    return response.data;
  },

  // Obter uma oferta específica
  obter: async (id: number) => {
    const response = await api.get<Oferta>(`/oferta/${id}`);
    return response.data;
  },

  // Criar nova oferta
  criar: async (oferta: Omit<Oferta, 'id'>) => {
    const response = await api.post<Oferta>('/oferta', oferta);
    return response.data;
  },

  // Atualizar oferta existente
  atualizar: async (id: number, oferta: Partial<Oferta>) => {
    const response = await api.put<Oferta>(`/oferta/${id}`, oferta);
    return response.data;
  },

  // Excluir oferta
  excluir: async (id: number) => {
    await api.delete(`/oferta/${id}`);
  }
};