import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Estoque } from '../../types';
import { EstoqueForm } from './EstoqueForm';
import { estoqueService } from '../../services/estoqueService';
import { toast } from 'react-hot-toast';

export function Estoques() {
  const [estoques, setEstoques] = useState<Estoque[]>([]);
  const [selectedEstoque, setSelectedEstoque] = useState<Estoque | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar estoques
  const loadEstoques = async () => {
    setIsLoading(true);
    try {
      const response = await estoqueService.listar();
      setEstoques(response);
    } catch (error) {
      console.error('Erro ao carregar estoques:', error);
      toast.error('Erro ao carregar estoques');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEstoques();
  }, []);

  const handleEdit = (estoque: Estoque) => {
    setSelectedEstoque(estoque);
    setIsModalOpen(true);
  };

  // Apagar estoque
  const handleDelete = async (estoque: Estoque) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro de estoque?')) return;

    try {
      await estoqueService.excluir(estoque.id!);
      toast.success('Registro de estoque excluído com sucesso!');
      loadEstoques(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir estoque:', error);
      toast.error('Erro ao excluir estoque');
    }
  };

  const columns = [
    { 
      key: 'produto',
      label: 'Produto',
      render: (produto: Estoque['produto']) => produto.nome
    },
    { key: 'data', label: 'Data' },
    { key: 'status', label: 'Status' },
    { key: 'quantidade', label: 'Quantidade' },
    { 
      key: 'preco',
      label: 'Preço',
      render: (valor: number) => `R$ ${valor.toFixed(2)}`
    },
  ];

  return (
    <Layout title="Estoque">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedEstoque(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Registro
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={estoques}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEstoque(null);
        }}
        title={selectedEstoque ? 'Editar Registro' : 'Novo Registro'}
      >
        <EstoqueForm
          initialData={selectedEstoque}
          onSuccess={loadEstoques}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEstoque(null);
          }}
        />
      </Modal>
    </Layout>
  );
}