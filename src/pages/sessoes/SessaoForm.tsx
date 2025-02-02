import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Sessao, Filme, Sala } from '../../types';
import { sessoesService } from '../../services/sessoesService';
import { filmesService } from '../../services/filmesService';
import { salasService } from '../../services/salasService';
import { toast } from 'react-hot-toast';

type SessaoFormProps = {
  initialData?: Sessao | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function SessaoForm({ initialData, onSuccess, onClose, isLoading }: SessaoFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<Sessao>({
    defaultValues: initialData || {
      lugaresDisponiveis: []
    }
  });

  const [filmes, setFilmes] = useState<Filme[]>([]); // Estado para armazenar a lista de filmes
  const [salas, setSalas] = useState<Sala[]>([]); // Estado para armazenar a lista de salas
  const [isLoadingFilmes, setIsLoadingFilmes] = useState(false); // Estado para controlar o carregamento dos filmes
  const [isLoadingSalas, setIsLoadingSalas] = useState(false); // Estado para controlar o carregamento das salas

  // Busca a lista de filmes
  const loadFilmes = async () => {
    setIsLoadingFilmes(true);
    try {
      const response = await filmesService.listar();
      setFilmes(response);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      toast.error('Erro ao carregar filmes');
    } finally {
      setIsLoadingFilmes(false);
    }
  };

  // Busca a lista de salas
  const loadSalas = async () => {
    setIsLoadingSalas(true);
    try {
      const response = await salasService.listar();
      setSalas(response);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast.error('Erro ao carregar salas');
    } finally {
      setIsLoadingSalas(false);
    }
  };

  // Carrega filmes e salas ao abrir o formulário
  useEffect(() => {
    loadFilmes();
    loadSalas();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      const filme = filmes.find(f => f.id === parseInt(data.filmeId));
      const sala = salas.find(s => s.id === parseInt(data.salaId));

      if (!filme || !sala) {
        toast.error('Filme ou sala não encontrados');
        return;
      }

      // Gera array de lugares disponíveis baseado na capacidade da sala
      const lugaresDisponiveis = Array.from(
        { length: sala.capacidade },
        (_, i) => i + 1
      );

      const sessaoData = {
        ...data,
        filme,
        sala,
        lugaresDisponiveis,
        valorIngresso: parseFloat(data.valorIngresso)
      };

      if (initialData?.id) {
        // Atualiza sessão existente
        await sessoesService.atualizar(initialData.id, sessaoData);
        toast.success('Sessão atualizada com sucesso!');
      } else {
        // Cria nova sessão
        await sessoesService.criar(sessaoData);
        toast.success('Sessão criada com sucesso!');
      }
      onSuccess(); // Recarrega a lista de sessões
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar sessão:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar sessão');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Filme
        </label>
        <select
          {...register('filmeId')}
          defaultValue={initialData?.filme.id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoadingFilmes}
        >
          <option value="">Selecione um filme</option>
          {filmes.map(filme => (
            <option key={filme.id} value={filme.id}>
              {filme.titulo}
            </option>
          ))}
        </select>
        {isLoadingFilmes && (
          <p className="text-sm text-gray-500">Carregando filmes...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Sala
        </label>
        <select
          {...register('salaId')}
          defaultValue={initialData?.sala.id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoadingSalas}
        >
          <option value="">Selecione uma sala</option>
          {salas.map(sala => (
            <option key={sala.id} value={sala.id}>
              Sala {sala.numero} - {sala.tipo}
            </option>
          ))}
        </select>
        {isLoadingSalas && (
          <p className="text-sm text-gray-500">Carregando salas...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data e Hora
        </label>
        <input
          type="datetime-local"
          {...register('dataHora')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Valor do Ingresso
        </label>
        <input
          type="number"
          step="0.01"
          {...register('valorIngresso')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Idioma
        </label>
        <select
          {...register('idioma')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Dublado">Dublado</option>
          <option value="Legendado">Legendado</option>
          <option value="Original">Original</option>
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