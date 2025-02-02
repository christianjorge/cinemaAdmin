import React from 'react';
import { useForm } from 'react-hook-form';
import { Sala } from '../../types';
import { toast } from 'react-hot-toast';
import { api } from '../../services/api';

type SalaFormProps = {
  initialData?: Sala | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function SalaForm({ initialData, onSuccess, onClose, isLoading }: SalaFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Sala>({
    defaultValues: initialData || {}
  });

  const handleCreate = async (data: Sala) => {
    try {
      if (initialData?.id) {
        // Atualiza sala existente
        await api.put(`/salas/${initialData.id}`, data);
        toast.success('Sala atualizada com sucesso!');
      } else {
        // Cria nova sala
        await api.post('/salas', data);
        toast.success('Sala criado com sucesso!');
      }
      onSuccess(); // Recarrega a lista de salas
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar sala:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar sala');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número da Sala
        </label>
        <input
          type="number"
          {...register('numero')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Capacidade
        </label>
        <input
          type="number"
          {...register('capacidade')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo
        </label>
        <select
          {...register('tipo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="NORMAL">Normal</option>
          <option value="VIP">VIP</option>
          <option value="3D">3D</option>
          <option value="IMAX">IMAX</option>
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
          <option value="ATIVA">Ativa</option>
          <option value="MANUTENCAO">Em Manutenção</option>
          <option value="INATIVA">Inativa</option>
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
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}