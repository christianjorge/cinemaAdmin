import React from 'react';
import { useForm } from 'react-hook-form';
import { Produto } from '../../types';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

type ProdutoFormProps = {
  initialData?: Produto | null;
  onSuccess: () => void;
  onClose: () => void;
};

export function ProdutoForm({ initialData, onSuccess, onClose }: ProdutoFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Produto>({
    defaultValues: initialData || {}
  });

  const handleCreate = async (data: Produto) => {
    try {
      if (initialData?.id) {
        // Atualiza produto existente
        await api.put(`/produtos/${initialData.id}`, data);
        toast.success('Produto atualizado com sucesso!');
      } else {
        // Cria novo produto
        await api.post('/produtos', data);
        toast.success('Produto criado com sucesso!');
      }
      onSuccess(); // Recarrega a lista de produtos
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar produto');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          type="text"
          {...register('nome', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register('descricao', { required: true })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register('valor', { required: true, min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantidade Disponível
        </label>
        <input
          type="number"
          min="0"
          {...register('qtdDisp', { required: true, min: 0 })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
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
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}
