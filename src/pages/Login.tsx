import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { Film } from 'lucide-react';

type LoginForm = {
  email: string;
  senha: string;
};

export function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const onSubmit = async (data: LoginForm) => {
    try {
      // TODO: Implementar integração com a API
      // const response = await api.post('/auth/login', data);
      // setAuth(response.data.usuario, response.data.token);
      
      // Mock do usuário para desenvolvimento
      setAuth({
        id: 1,
        nomeCompleto: 'Administrador',
        email: data.email,
        senha: '',
        dataNascimento: '1990-01-01',
        cpf: '000.000.000-00',
        telefone: '(00) 00000-0000',
        endereco: 'Rua Teste, 123',
        nivelAcesso: 'ADMIN',
        dataCadastro: '2024-01-01',
        status: 'ATIVO'
      }, 'token-mock');
      
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Film className="w-12 h-12 text-blue-600 mb-2" />
          <h1 className="text-2xl font-bold text-gray-900">Cinema Admin</h1>
          <p className="text-gray-600">Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              {...register('senha')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}