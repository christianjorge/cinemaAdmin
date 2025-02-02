import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Fidelidade } from '../../types';
import { FidelidadeForm } from './FidelidadeForm';
import { fidelidadesService } from '../../services/fidelidadesService';
import { toast } from 'react-hot-toast';

export function Fidelidades() {
  const [fidelidades, setFidelidades] = useState<Fidelidade[]>([]);
  const [selectedFidelidade, setSelectedFidelidade] = useState<Fidelidade | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar fidelidades
  const loadFidelidades = async () => {
    setIsLoading(true);
    try {
      const response = await fidelidadesService.listar();
      setFidelidades(response);
    } catch (error) {
      console.error('Erro ao carregar fidelidades:', error);
      toast.error('Erro ao carregar fidelidades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFidelidades();
  }, []);

  const handleEdit = (fidelidade: Fidelidade) => {
    setSelectedFidelidade(fidelidade);
    setIsModalOpen(true);
  };

  // Apagar fidelidade
  const handleDelete = async (fidelidade: Fidelidade) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano de fidelidade?')) return;

    try {
      await fidelidadesService.excluir(fidelidade.id!);
      toast.success('Plano de fidelidade excluído com sucesso!');
      loadFidelidades(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir fidelidade:', error);
      toast.error('Erro ao excluir fidelidade');
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome do Plano' },
    { 
      key: 'valorMensalidade',
      label: 'Mensalidade',
      render: (valor: number) => `R$ ${valor.toFixed(2)}`
    },
    { key: 'pontuacao', label: 'Pontos' },
    { key: 'dataAdesao', label: 'Data de Adesão' },
    { key: 'dataValidade', label: 'Validade' },
    { key: 'status', label: 'Status' },
    { 
      key: 'usuario',
      label: 'Cliente',
      render: (usuario: Fidelidade['usuario']) => usuario.nomeCompleto
    },
  ];

  return (
    <Layout title="Clube de Fidelidade">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedFidelidade(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Plano
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={fidelidades}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFidelidade(null);
        }}
        title={selectedFidelidade ? 'Editar Plano' : 'Novo Plano'}
      >
        <FidelidadeForm
          initialData={selectedFidelidade}
          onSuccess={loadFidelidades}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFidelidade(null);
          }}
        />
      </Modal>
    </Layout>
  );
}