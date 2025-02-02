import React from 'react';
import { useForm } from 'react-hook-form';
import { Filme } from '../../types';
import { toast } from 'react-hot-toast';
import { filmesService } from '../../services/filmesService';

type FilmeFormProps = {
  initialData?: Filme | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function FilmeForm({ initialData, onSuccess, onClose, isLoading }: FilmeFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Filme>({
    defaultValues: initialData || {
      generos: []
    }
  });

  const handleCreate = async (data: Filme) => {
    try {
      // Transforma a string de gêneros em um array de strings
      const generosArray = typeof data.generos === 'string' 
        ? data.generos.split(',').map(g => g.trim()) 
        : data.generos;

      const filmeData = {
        ...data,
        generos: generosArray
      };

      if (initialData?.id) {
        // Atualiza filme existente
        await filmesService.atualizar(initialData.id, filmeData);
        toast.success('Filme atualizado com sucesso!');
      } else {
        // Cria novo filme
        await filmesService.criar(filmeData);
        toast.success('Filme criado com sucesso!');
      }
      onSuccess(); // Recarrega a lista de filmes
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar filme:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar filme');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          {...register('titulo')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sinopse
        </label>
        <textarea
          {...register('sinopse')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Lançamento
        </label>
        <input
          type="date"
          {...register('lancamento')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nota
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          {...register('nota')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Duração (minutos)
        </label>
        <input
          type="number"
          {...register('duracao')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Classificação
        </label>
        <select
          {...register('classificacao')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="L">Livre</option>
          <option value="10">10 anos</option>
          <option value="12">12 anos</option>
          <option value="14">14 anos</option>
          <option value="16">16 anos</option>
          <option value="18">18 anos</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gêneros (separados por vírgula)
        </label>
        <input
          type="text"
          {...register('generos')}
          placeholder="Ação, Aventura, Comédia"
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
          disabled={isSubmitting || isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting || isLoading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}