import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Produto } from '../../types';
import { ProdutoForm } from './ProdutoForm';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadProdutos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Produto[]>('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProdutos();
  }, []);

  const handleEdit = (produto: Produto) => {
    setSelectedProduto(produto);
    setIsModalOpen(true);
  };

  const handleDelete = async (produto: Produto) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await api.delete(`/produtos/${produto.id}`);
      toast.success('Produto excluído com sucesso!');
      loadProdutos(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast.error('Erro ao excluir produto');
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { 
      key: 'valor', 
      label: 'Valor',
      render: (valor: any) => `R$ ${Number(valor).toFixed(2)}`
    },
    { key: 'qtdDisp', label: 'Quantidade Disponível' },
  ];

  return (
    <Layout title="Produtos">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedProduto(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Produto
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={produtos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduto(null);
        }}
        title={selectedProduto ? 'Editar Produto' : 'Novo Produto'}
      >
        <ProdutoForm
          initialData={selectedProduto}
          onSuccess={loadProdutos}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduto(null);
          }}
        />
      </Modal>
    </Layout>
  );
}
