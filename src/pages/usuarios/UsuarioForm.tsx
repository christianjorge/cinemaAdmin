import React from 'react';
import { useForm } from 'react-hook-form';
import { Usuario } from '../../types';
import { usuariosService } from '../../services/usuariosService';
import { toast } from 'react-hot-toast';

type UsuarioFormProps = {
  initialData?: Usuario | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function UsuarioForm({ initialData, onSuccess, onClose, isLoading }: UsuarioFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Usuario>({
    defaultValues: initialData || {}
  });

  const handleCreate = async (data: Usuario) => {
    try {
      if (initialData?.id) {
        // Atualiza usuário existente
        await usuariosService.atualizar(initialData.id, data);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Cria novo usuário
        await usuariosService.criar(data);
        toast.success('Usuário criado com sucesso!');
      }
      onSuccess(); // Recarrega a lista de usuários
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome Completo
        </label>
        <input
          type="text"
          {...register('nomeCompleto')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {!initialData && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            type="password"
            {...register('senha')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          CPF
        </label>
        <input
          type="text"
          {...register('cpf')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Nascimento
        </label>
        <input
          type="date"
          {...register('dataNascimento')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>
        <input
          type="text"
          {...register('telefone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Endereço
        </label>
        <input
          type="text"
          {...register('endereco')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nível de Acesso
        </label>
        <select
          {...register('nivelAcesso')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="CLIENTE">Cliente</option>
          <option value="FUNCIONARIO">Funcionário</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register('status')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting || isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}