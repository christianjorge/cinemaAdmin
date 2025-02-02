import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { Modal } from '../../components/Modal';
import { Usuario } from '../../types';
import { UsuarioForm } from './UsuarioForm';
import { usuariosService } from '../../services/usuariosService';
import { toast } from 'react-hot-toast';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar usuários
  const loadUsuarios = async () => {
    setIsLoading(true);
    try {
      const response = await usuariosService.listar();
      setUsuarios(response);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  // Apagar usuário
  const handleDelete = async (usuario: Usuario) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await usuariosService.excluir(usuario.id!);
      toast.success('Usuário excluído com sucesso!');
      loadUsuarios(); // Recarrega a lista
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const columns = [
    { key: 'nomeCompleto', label: 'Nome' },
    { key: 'email', label: 'Email' },
    { key: 'cpf', label: 'CPF' },
    { key: 'dataNascimento', label: 'Data de Nascimento' },
    { key: 'nivelAcesso', label: 'Nível de Acesso' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <Layout title="Usuários">
      <div className="mb-4">
        <button
          onClick={() => {
            setSelectedUsuario(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Novo Usuário
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table
          columns={columns}
          data={usuarios}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUsuario(null);
        }}
        title={selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
      >
        <UsuarioForm
          initialData={selectedUsuario}
          onSuccess={loadUsuarios}
          isLoading={isLoading}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUsuario(null);
          }}
        />
      </Modal>
    </Layout>
  );
}