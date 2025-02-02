import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { filmesService } from '../../services/filmesService';
import { Filme } from '../../types';
import { FilmeForm } from './FilmeForm';
import { toast } from 'react-hot-toast';

export function Filmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [selectedFilme, setSelectedFilme] = useState<Filme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar filmes
  const loadFilmes = async () => {
    setIsLoading(true);
    try {
      const response = await filmesService.listar();
      setFilmes(response);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
      toast.error('Erro ao carregar filmes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFilmes();
  }, []);

  const handleEdit = (filme: Filme) => {
    setSelectedFilme(filme);
    setIsModalOpen(true);
  };

  // Apagar filme
  const handleDelete = async (filme: Filme) => {
    if (!window.confirm('Tem certeza que deseja excluir este filme?')) return;

    try {
      await filmesService.excluir(filme.id!);
      toast.success('Filme excluído com sucesso!');
      loadFilmes(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir filme:', error);
      toast.error('Erro ao excluir filme');
    }
  };

  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'lancamento', label: 'Lançamento' },
    { key: 'duracao', label: 'Duração (min)' },
    { key: 'classificacao', label: 'Classificação' },
    { 
      key: 'generos', 
      label: 'Gêneros',
      render: (generos: string[]) => generos.join(', ')
    },
    { key: 'nota', label: 'Nota' },
  ];

  return (
    <Layout title="Filmes">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedFilme(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Filme
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={filmes}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFilme(null);
        }}
        title={selectedFilme ? 'Editar Filme' : 'Novo Filme'}
      >
        <FilmeForm
          initialData={selectedFilme}
          onSuccess={loadFilmes}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFilme(null);
          }}
        />
      </Modal>
    </Layout>
  );
}