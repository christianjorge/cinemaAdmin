import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { salasService } from '../../services/salasService';
import { Sala } from '../../types';
import { SalaForm } from './SalaForm';
import { toast } from 'react-hot-toast';

export function Salas() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Carregar Sala
  const loadSalas = async () => {
    setIsLoading(true);
    try {
      const response = await salasService.listar();
      setSalas(response);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast.error('Erro ao carregar salas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSalas();
  }, []);

  const handleEdit = (sala: Sala) => {
    setSelectedSala(sala);
    setIsModalOpen(true);
  };

  //Apagar Sala
  const handleDelete = async (sala: Sala) => {
    if (!window.confirm('Tem certeza que deseja excluir esta sala?')) return;

    try {
      await salasService.excluir(sala.id);
      toast.success('Sala excluída com sucesso!');
      loadSalas(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      toast.error('Erro ao excluir sala');
    }
  };

  const columns = [
    { key: 'numero', label: 'Número' },
    { key: 'capacidade', label: 'Capacidade' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <Layout title="Salas">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedSala(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nova Sala
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={salas}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSala(null);
        }}
        title={selectedSala ? 'Editar Sala' : 'Nova Sala'}
      >
        <SalaForm
          initialData={selectedSala}
          onSuccess={loadSalas}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSala(null);
          }}
        />
      </Modal>
    </Layout>
  );
}