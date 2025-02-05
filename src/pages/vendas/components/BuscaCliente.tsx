import React, { useState } from 'react';
import { Modal } from '../../../components/Modal';
import { ClienteForm } from './ClienteForm';
import { Usuario } from '../../../types';
import { Search } from 'lucide-react';
import { api } from '../../../services/api';
import { toast } from 'react-hot-toast';

type BuscaClienteProps = {
  onClienteSelect: (cliente: Usuario) => void;
};

export function BuscaCliente({ onClienteSelect }: BuscaClienteProps) {
  const [cpf, setCpf] = useState('');
  const [showNovoClienteModal, setShowNovoClienteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Função para formatar o CPF
  const formatarCPF = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    // Aplica a máscara
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14); // Limita o tamanho máximo
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCPF(e.target.value);
    setCpf(valorFormatado);
  };

  const cadastrarNovoCliente = async (data: Partial<Usuario>) => {
    setIsLoading(true);
    try {
      const novoCliente = {
        ...data,
        cpf,
        nivelAcesso: 'CLIENTE',
        status: 'ATIVO'
      };

      const response = await api.post('/usuarios', novoCliente);
      onClienteSelect(response.data);
      toast.success('Cliente cadastrado com sucesso!');
      setShowNovoClienteModal(false);
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
      toast.error('Erro ao cadastrar cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const buscarCliente = async () => {
    if (!cpf) {
      toast.error('Digite um CPF');
      return;
    }

    // Valida se o CPF está completo
    if (cpf.length < 14) {
      toast.error('CPF incompleto');
      return;
    }

    setIsLoading(true);
    try {
      // Certifica que a URL base está correta
      const response = await api.get(`/usuarios/cpf/${cpf}`);
      
      if (response.data) {
        onClienteSelect(response.data);
        toast.success('Cliente encontrado!');
      }
    } catch (error: any) {
      console.error('Erro ao buscar cliente:', error);
      
      // Se o erro for 404, abre o modal de cadastro
      if (error.response?.status === 404) {
        toast.error('Cliente não encontrado');
        setShowNovoClienteModal(true);
      } else {
        toast.error('Erro ao buscar cliente. Verifique sua conexão.');
      }
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
            onChange={handleCPFChange}
            placeholder="000.000.000-00"
            maxLength={14}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <button
          onClick={buscarCliente}
          disabled={isLoading || !cpf || cpf.length < 14}
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