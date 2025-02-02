import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Sessao } from '../../types';
import { SessaoForm } from './SessaoForm';
import { sessoesService } from '../../services/sessoesService';
import { toast } from 'react-hot-toast';

export function Sessoes() {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [selectedSessao, setSelectedSessao] = useState<Sessao | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar sessões
  const loadSessoes = async () => {
    setIsLoading(true);
    try {
      const response = await sessoesService.listar();
      setSessoes(response);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      toast.error('Erro ao carregar sessões');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessoes();
  }, []);

  const handleEdit = (sessao: Sessao) => {
    setSelectedSessao(sessao);
    setIsModalOpen(true);
  };

  // Apagar sessão
  const handleDelete = async (sessao: Sessao) => {
    if (!window.confirm('Tem certeza que deseja excluir esta sessão?')) return;

    try {
      await sessoesService.excluir(sessao.id!);
      toast.success('Sessão excluída com sucesso!');
      loadSessoes(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir sessão:', error);
      toast.error('Erro ao excluir sessão');
    }
  };

  const columns = [
    { 
      key: 'filme',
      label: 'Filme',
      render: (filme: Sessao['filme']) => filme.titulo
    },
    { 
      key: 'sala',
      label: 'Sala',
      render: (sala: Sessao['sala']) => `Sala ${sala.numero}`
    },
    { key: 'dataHora', label: 'Data e Hora' },
    { 
      key: 'valorIngresso',
      label: 'Valor',
      render: (valor: number) => `R$ ${valor.toFixed(2)}`
    },
    { key: 'idioma', label: 'Idioma' },
    {
      key: 'lugaresDisponiveis',
      label: 'Lugares Disponíveis',
      render: (lugares: number[]) => lugares.length
    },
  ];

  return (
    <Layout title="Sessões">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedSessao(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Nova Sessão
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={sessoes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSessao(null);
        }}
        title={selectedSessao ? 'Editar Sessão' : 'Nova Sessão'}
      >
        <SessaoForm
          initialData={selectedSessao}
          onSuccess={loadSessoes}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSessao(null);
          }}
        />
      </Modal>
    </Layout>
  );
}