import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Oferta } from '../../types';
import { OfertaForm } from './OfertaForm';
import { ofertasService } from '../../services/ofertasService';
import { toast } from 'react-hot-toast';

export function Ofertas() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar ofertas
  const loadOfertas = async () => {
    setIsLoading(true);
    try {
      const response = await ofertasService.listar();
      setOfertas(response);
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error);
      toast.error('Erro ao carregar ofertas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOfertas();
  }, []);

  const handleEdit = (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setIsModalOpen(true);
  };

  // Apagar oferta
  const handleDelete = async (oferta: Oferta) => {
    if (!window.confirm('Tem certeza que deseja excluir esta oferta?')) return;

    try {
      await ofertasService.excluir(oferta.id!);
      toast.success('Oferta excluída com sucesso!');
      loadOfertas(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir oferta:', error);
      toast.error('Erro ao excluir oferta');
    }
  };

  const columns = [
    { 
      key: 'produto',
      label: 'Produto',
      render: (produto: Oferta['produto']) => produto.nome
    },
    { key: 'dataInicio', label: 'Início' },
    { key: 'dataFim', label: 'Fim' },
    { key: 'descricao', label: 'Descrição' },
    { 
      key: 'percentualDesconto',
      label: 'Desconto',
      render: (valor: number) => `${valor}%`
    },
  ];

  return (
    <Layout title="Ofertas">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedOferta(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nova Oferta
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={ofertas}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOferta(null);
        }}
        title={selectedOferta ? 'Editar Oferta' : 'Nova Oferta'}
      >
        <OfertaForm
          initialData={selectedOferta}
          onSuccess={loadOfertas}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedOferta(null);
          }}
        />
      </Modal>
    </Layout>
  );
}