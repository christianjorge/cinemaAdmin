import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Oferta, Produto } from '../../types';
import { ofertasService } from '../../services/ofertasService';
import { produtosService } from '../../services/produtosService';
import { toast } from 'react-hot-toast';

type OfertaFormProps = {
  initialData?: Oferta | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function OfertaForm({ initialData, onSuccess, onClose, isLoading }: OfertaFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialData || {}
  });

  const [produtos, setProdutos] = useState<Produto[]>([]); // Estado para armazenar a lista de produtos
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false); // Estado para controlar o carregamento dos produtos

  // Busca a lista de produtos
  const loadProdutos = async () => {
    setIsLoadingProdutos(true);
    try {
      const response = await produtosService.listar();
      setProdutos(response);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  // Carrega os produtos ao abrir o formulário
  useEffect(() => {
    loadProdutos();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      const produto = produtos.find(p => p.id === parseInt(data.produtoId));

      if (!produto) {
        toast.error('Produto não encontrado');
        return;
      }

      const ofertaData = {
        ...data,
        produto,
        percentualDesconto: parseFloat(data.percentualDesconto)
      };

      if (initialData?.id) {
        // Atualiza oferta existente
        await ofertasService.atualizar(initialData.id, ofertaData);
        toast.success('Oferta atualizada com sucesso!');
      } else {
        // Cria nova oferta
        await ofertasService.criar(ofertaData);
        toast.success('Oferta criada com sucesso!');
      }
      onSuccess(); // Recarrega a lista de ofertas
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar oferta:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar oferta');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Produto
        </label>
        <select
          {...register('produtoId')}
          defaultValue={initialData?.produto.id}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isLoadingProdutos}
        >
          <option value="">Selecione um produto</option>
          {produtos.map(produto => (
            <option key={produto.id} value={produto.id}>
              {produto.nome}
            </option>
          ))}
        </select>
        {isLoadingProdutos && (
          <p className="text-sm text-gray-500">Carregando produtos...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Início
        </label>
        <input
          type="date"
          {...register('dataInicio')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data de Fim
        </label>
        <input
          type="date"
          {...register('dataFim')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register('descricao')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Percentual de Desconto
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          {...register('percentualDesconto')}
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