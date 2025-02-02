import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Estoque, Produto } from '../../types';
import { estoqueService } from '../../services/estoqueService';
import { produtosService } from '../../services/produtosService';
import { toast } from 'react-hot-toast';

type EstoqueFormProps = {
  initialData?: Estoque | null;
  onSuccess: () => void;
  onClose: () => void;
  isLoading?: boolean;
};

export function EstoqueForm({ initialData, onSuccess, onClose, isLoading }: EstoqueFormProps) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: initialData || {}
  });

  const [produtos, setProdutos] = useState<Produto[]>([]); // Estado para armazenar a lista de produtos
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false); // Estado para controlar o carregamento dos produtos

  // Busca a lista de produtos usando o produtosService
  const loadProdutos = async () => {
    setIsLoadingProdutos(true);
    try {
      const response = await produtosService.listar(); // Usa o produtosService para buscar os produtos
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

      const estoqueData = {
        ...data,
        produto,
        preco: parseFloat(data.preco),
        quantidade: parseInt(data.quantidade)
      };

      if (initialData?.id) {
        // Atualiza estoque existente
        await estoqueService.atualizar(initialData.id, estoqueData);
        toast.success('Registro de estoque atualizado com sucesso!');
      } else {
        // Cria novo estoque
        await estoqueService.criar(estoqueData);
        toast.success('Registro de estoque criado com sucesso!');
      }
      onSuccess(); // Recarrega a lista de estoques
      onClose(); // Fecha o modal
    } catch (error: any) {
      console.error('Erro ao salvar estoque:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar estoque');
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
          Data
        </label>
        <input
          type="date"
          {...register('data')}
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
          <option value="DISPONIVEL">Disponível</option>
          <option value="INDISPONIVEL">Indisponível</option>
          <option value="BAIXO">Estoque Baixo</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantidade
        </label>
        <input
          type="number"
          min="0"
          {...register('quantidade')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preço
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          {...register('preco')}
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