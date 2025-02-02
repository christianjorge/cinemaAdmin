import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Fidelidade, Usuario } from '../../types';
import { fidelidadesService } from '../../services/fidelidadesService';
import { usuariosService } from '../../services/usuariosService';
import { toast } from 'react-hot-toast';

type FidelidadeFormProps = {
  initialData?: Fidelidade | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function FidelidadeForm({ initialData, onSuccess, onClose, isLoading }: FidelidadeFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialData || {}
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]); // Estado para armazenar a lista de usuários (clientes)
  const [isLoadingUsuarios, setIsLoadingUsuarios] = useState(false); // Estado para controlar o carregamento dos usuários

  // Busca a lista de usuários (clientes)
  const loadUsuarios = async () => {
    setIsLoadingUsuarios(true);
    try {
      const response = await usuariosService.listar();
      // Filtra apenas os usuários com nível de acesso "CLIENTE"
      const clientes = response.filter(usuario => usuario.nivelAcesso === 'CLIENTE');
      setUsuarios(clientes);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoadingUsuarios(false);
    }
  };

  // Carrega os usuários ao abrir o formulário
  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      const usuario = usuarios.find(u => u.id === parseInt(data.usuarioId));

      if (!usuario) {
        toast.error('Cliente não encontrado');
        return;
      }

      const fidelidadeData = {
        ...data,
        usuario,
        valorMensalidade: parseFloat(data.valorMensalidade),
        pontuacao: parseInt(data.pontuacao)
      };

      if (initialData?.id) {
        // Atualiza fidelidade existente
        await fidelidadesService.atualizar(initialData.id, fidelidadeData);
        toast.success('Plano de fidelidade atualizado com sucesso!');
      } else {
        // Cria nova fidelidade
        await fidelidadesService.criar(fidelidadeData);
        toast.success('Plano de fidelidade criado com sucesso!');
      }
      onSuccess(); // Recarrega a lista de fidelidades
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar fidelidade:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar fidelidade');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome do Plano
        </label>
        <input
          type="text"
          {...register('nome')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Cliente
        </label>
        <select
          {...register('usuarioId')}
          defaultValue={initialData?.usuario.id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoadingUsuarios}
        >
          <option value="">Selecione um cliente</option>
          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nomeCompleto} - {usuario.cpf}
            </option>
          ))}
        </select>
        {isLoadingUsuarios && (
          <p className="text-sm text-gray-500">Carregando clientes...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor da Mensalidade
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register('valorMensalidade')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pontuação
        </label>
        <input
          type="number"
          min="0"
          {...register('pontuacao')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Adesão
        </label>
        <input
          type="date"
          {...register('dataAdesao')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Validade
        </label>
        <input
          type="date"
          {...register('dataValidade')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
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
          <option value="SUSPENSO">Suspenso</option>
          <option value="CANCELADO">Cancelado</option>
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