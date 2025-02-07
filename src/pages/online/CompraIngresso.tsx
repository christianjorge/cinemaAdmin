import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, CreditCard, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Sessao, Produto } from '../../types';
import { api } from '../../services/api';
import { ComprovantePedido } from '../../components/ComprovantePedido';

type ItemCarrinho = {
  tipo: 'ingresso' | 'produto';
  sessao?: Sessao;
  lugar?: number;
  produto?: Produto;
  quantidade: number;
  valor: number;
};

export function CompraIngresso() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [lugarSelecionado, setLugarSelecionado] = useState<number | null>(null);
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSessoes, setIsLoadingSessoes] = useState(false);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [comprovante, setComprovante] = useState<any>(null);
  const [reservaId, setReservaId] = useState<string | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number>(0);

  useEffect(() => {
    carregarSessoes();
    carregarProdutos();
  }, []);

  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (tempoRestante === 0 && reservaId) {
      cancelarReserva();
      setLugarSelecionado(null);
      toast.error('Tempo para finalizar a compra expirou!');
    }
  }, [tempoRestante]);

  const carregarSessoes = async () => {
    setIsLoadingSessoes(true);
    try {
      const response = await api.get('/sessoes');
      setSessoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
      toast.error('Erro ao carregar sessões');
    } finally {
      setIsLoadingSessoes(false);
    }
  };

  const carregarProdutos = async () => {
    setIsLoadingProdutos(true);
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  const formatarCPF = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    return apenasNumeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .slice(0, 14);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarCPF(e.target.value);
    setCpf(valorFormatado);
  };

  const reservarLugar = async (lugar: number) => {
    if (!sessaoSelecionada) return;

    if (reservaId) {
      await cancelarReserva();
    }

    const novaReservaId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setReservaId(novaReservaId);
    setLugarSelecionado(lugar);
    setTempoRestante(600); // 10 minutos

    setCarrinho(prev => [
      ...prev,
      {
        tipo: 'ingresso',
        sessao: sessaoSelecionada,
        lugar,
        quantidade: 1,
        valor: sessaoSelecionada.valorIngresso
      }
    ]);

    toast.success('Lugar reservado! Você tem 10 minutos para finalizar a compra.');
  };

  const adicionarProduto = (produto: Produto) => {
    const itemExistente = carrinho.find(
      item => item.tipo === 'produto' && item.produto?.id === produto.id
    );

    if (itemExistente) {
      setCarrinho(prev => prev.map(item =>
        item === itemExistente
          ? { ...item, quantidade: item.quantidade + 1, valor: produto.valor * (item.quantidade + 1) }
          : item
      ));
      toast.success('Quantidade atualizada no carrinho');
    } else {
      setCarrinho(prev => [
        ...prev,
        {
          tipo: 'produto',
          produto,
          quantidade: 1,
          valor: produto.valor
        }
      ]);
      toast.success('Produto adicionado ao carrinho');
    }
  };

  const removerDoCarrinho = (index: number) => {
    const item = carrinho[index];
    if (item.tipo === 'ingresso') {
      cancelarReserva();
    }
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const atualizarQuantidade = (index: number, quantidade: number) => {
    if (quantidade < 1) return;

    setCarrinho(prev => prev.map((item, i) => {
      if (i === index && item.tipo === 'produto' && item.produto) {
        return {
          ...item,
          quantidade,
          valor: item.produto.valor * quantidade
        };
      }
      return item;
    }));
  };

  const cancelarReserva = async () => {
    setReservaId(null);
    setTempoRestante(0);
    setCarrinho(prev => prev.filter(item => item.tipo !== 'ingresso'));
    setLugarSelecionado(null);
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.valor, 0);
  };

  const formatarTempoRestante = () => {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const finalizarCompra = async () => {
    if (!cpf || carrinho.length === 0) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    if (!cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
      toast.error('CPF inválido');
      return;
    }

    setIsLoading(true);
    try {
      const pedidoId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const pedido = {
        id: pedidoId,
        cliente: {
          nome: 'Cliente',
          cpf,
        },
        itens: carrinho,
        valorTotal: calcularTotal(),
      };

      setComprovante(pedido);
      toast.success('Compra realizada com sucesso!');
      
      setSessaoSelecionada(null);
      setLugarSelecionado(null);
      setCpf('');
      setReservaId(null);
      setTempoRestante(0);
      setCarrinho([]);
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      toast.error('Erro ao finalizar compra');
    } finally {
      setIsLoading(false);
    }
  };

  const sessoesFiltradas = sessoes.filter(sessao =>
    sessao.filme.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoadingSessoes || isLoadingProdutos) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Cinema Online</h1>
          <p className="mt-2 text-blue-100">Compre seus ingressos e produtos sem sair de casa</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Barra de Pesquisa */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar filmes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Sessões e Produtos */}
            <div className="lg:col-span-2 space-y-6">
              {/* Sessões */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Sessões Disponíveis</h2>
                  <div className="space-y-4">
                    {sessoesFiltradas.map(sessao => (
                      <div
                        key={sessao.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          sessaoSelecionada?.id === sessao.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'hover:border-gray-400'
                        }`}
                        onClick={() => setSessaoSelecionada(sessao)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{sessao.filme.titulo}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(sessao.dataHora).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(sessao.dataHora).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <span className="text-lg font-semibold">
                            R$ {sessao.valorIngresso.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm mt-2">
                          Sala {sessao.sala.numero} - {sessao.idioma}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Produtos */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Produtos</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {produtos.map(produto => (
                      <div
                        key={produto.id}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{produto.nome}</h3>
                            <p className="text-sm text-gray-600">{produto.descricao}</p>
                          </div>
                          <span className="text-lg font-semibold">
                            R$ {produto.valor.toFixed(2)}
                          </span>
                        </div>
                        <button
                          onClick={() => adicionarProduto(produto)}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Adicionar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Seleção de Lugar e Carrinho */}
            <div className="space-y-6">
              {sessaoSelecionada && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Selecione seu Lugar</h2>
                  <div className="grid grid-cols-8 gap-2">
                    {sessaoSelecionada.lugaresDisponiveis.map(lugar => {
                      const estaReservado = lugarSelecionado === lugar;
                      return (
                        <button
                          key={lugar}
                          onClick={() => reservarLugar(lugar)}
                          disabled={estaReservado}
                          className={`
                            p-2 rounded-md text-center text-sm
                            ${estaReservado
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-blue-100'}
                          `}
                        >
                          {lugar}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {carrinho.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Carrinho</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={handleCPFChange}
                        placeholder="000.000.000-00"
                        maxLength={14}
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="divide-y">
                      {carrinho.map((item, index) => (
                        <div key={index} className="py-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">
                                {item.tipo === 'ingresso'
                                  ? `Ingresso: ${item.sessao?.filme.titulo}`
                                  : item.produto?.nome}
                              </h3>
                              {item.tipo === 'ingresso' ? (
                                <p className="text-sm text-gray-600">
                                  Lugar: {item.lugar}
                                </p>
                              ) : (
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    onClick={() => atualizarQuantidade(index, item.quantidade - 1)}
                                    className="px-2 py-1 border rounded-md"
                                  >
                                    -
                                  </button>
                                  <span>{item.quantidade}</span>
                                  <button
                                    onClick={() => atualizarQuantidade(index, item.quantidade + 1)}
                                    className="px-2 py-1 border rounded-md"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-start gap-4">
                              <span className="font-medium">
                                R$ {item.valor.toFixed(2)}
                              </span>
                              <button
                                onClick={() => removerDoCarrinho(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-medium">Total:</span>
                        <span className="text-2xl font-bold">
                          R$ {calcularTotal().toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={finalizarCompra}
                        disabled={isLoading || !cpf || !carrinho.length}
                        className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        {isLoading ? 'Processando...' : 'Finalizar Compra'}
                      </button>

                      {tempoRestante > 0 && (
                        <p className="text-sm text-gray-500 text-center mt-2">
                          Tempo restante para finalizar a compra: {formatarTempoRestante()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {comprovante && (
        <ComprovantePedido
          pedido={comprovante}
          onClose={() => setComprovante(null)}
        />
      )}
    </div>
  );
}