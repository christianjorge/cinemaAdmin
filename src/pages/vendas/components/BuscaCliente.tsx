import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { ClienteForm } from './ClienteForm';
import { Usuario } from '../../../types';
import { Search } from 'lucide-react';

type BuscaClienteProps = {
  onClienteSelect: (cliente: Usuario) => void;
};

export function BuscaCliente({ onClienteSelect }: BuscaClienteProps) {
  const [cpf, setCpf] = useState('');
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buscarCliente = async () => {
    if (!cpf) return;

    setIsLoading(true);
    try {
      // TODO: Integrar com API
      // const response = await api.get(`/usuarios/cpf/${cpf}`);
      // if (response.data) {
      //   onClienteSelect(response.data);
      // } else {
      //   setShowNovoClienteModal(true);
      // }

      // Mock: Simula busca do cliente
      const clienteEncontrado = mockUsuarios.find(u => u.cpf === cpf);
      if (clienteEncontrado) {
        onClienteSelect(clienteEncontrado);
      } else {
        setShowNovoClienteModal(true);
      }
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      setShowNovoClienteModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const cadastrarNovoCliente = async (data: Partial<Usuario>) => {
    setIsLoading(true);
    try {
      // TODO: Integrar com API
      // const response = await api.post('/usuarios', {
      //   ...data,
      //   cpf,
      //   nivelAcesso: 'CLIENTE',
      //   status: 'ATIVO'
      // });
      // onClienteSelect(response.data);

      // Mock: Simula cadastro do cliente
      const novoCliente = {
        ...data,
        id: Math.random(),
        cpf,
        nivelAcesso: 'CLIENTE' as const,
        status: 'ATIVO' as const
      };
      onClienteSelect(novoCliente);
      setShowNovoClienteModal(false);
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        CPF do Cliente
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="Digite o CPF do cliente"
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={buscarCliente}
          disabled={isLoading || !cpf}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      <Modal
        isOpen={showNovoClienteModal}
        onClose={() => setShowNovoClienteModal(false)}
        title="Cadastrar Novo Cliente"
      >
        <ClienteForm
          onSubmit={cadastrarNovoCliente}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
}