import { api } from './api';
import { Usuario } from '../types';

export const usuariosService = {
  // Listar todos os usuários
  listar: async () => {
    const response = await api.get<Usuario[]>('/usuarios');
    return response.data;
  },

  // Obter um usuário específico
  obter: async (id: number) => {
    const response = await api.get<Usuario>(`/usuarios/${id}`);
    return response.data;
  },

  // Criar novo usuário
  criar: async (usuario: Omit<Usuario, 'id'>) => {
    const response = await api.post<Usuario>('/usuarios', usuario);
    return response.data;
  },

  // Atualizar usuário existente
  atualizar: async (id: number, usuario: Partial<Usuario>) => {
    const response = await api.put<Usuario>(`/usuarios/${id}`, usuario);
    return response.data;
  },

  // Excluir usuário
  excluir: async (id: number) => {
    await api.delete(`/usuarios/${id}`);
  }
};