import React, { useState, useMemo } from 'react';
import { Layout } from '../../components/Layout';
import { mockSessoes } from '../../services/mockData';
import { Search, Calendar, Clock, Ticket, Trash2 } from 'lucide-react';
import { BuscaCliente } from './components/BuscaCliente';
import { Usuario, Sessao } from '../../types';
import { vendasApi } from '../../services/vendasApi';
import { toast } from 'react-hot-toast';

type ItemCarrinho = {
  sessao: Sessao;
  numeroLugar: number;
};

export function VendaIngressos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Usuario | null>(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sessoesFiltradas = useMemo(() => {
    const termo = searchTerm.toLowerCase();
    return mockSessoes.filter(sessao => 
      sessao.filme.titulo.toLowerCase().includes(termo)
    );
  }, [searchTerm]);

  const verificarPontosFidelidade = (usuarioId: number) => {
    // TODO: Integrar com API
    // Retorna mock por enquanto
    return Math.floor(Math.random() * 10);
  };

  const adicionarAoCarrinho = (lugar: number) => {
    if (!sessaoSelecionada) return;

    if (carrinho.some(item => 
      item.sessao.id === sessaoSelecionada.id && 
      item.numeroLugar === lugar
    )) {
      toast.error('Este lugar já está no carrinho');
      return;
    }

    setCarrinho(prev => [...prev, {
      sessao: sessaoSelecionada,
      numeroLugar: lugar
    }]);
  };

  const removerDoCarrinho = (index: number) => {
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const calcularTotal = () => {
    const total = carrinho.reduce((sum, item) => 
      sum + item.sessao.valorIngresso, 0
    );

    // Se o cliente tem direito a ingresso grátis
    if (carrinho.length >= 10) {
      return total - carrinho[0].sessao.valorIngresso;
    }

    return total;
  };

  const finalizarVenda = async () => {
    if (!clienteSelecionado) {
      toast.error('Selecione um cliente para continuar');
      return;
    }

    if (carrinho.length === 0) {
      toast.error('Adicione ingressos ao carrinho');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrar com API
      // const vendaRequest = {
      //   usuarioId: clienteSelecionado.id!,
      //   itens: carrinho.map(item => ({
      //     ingressoId: item.numeroLugar,
      //     sessaoId: item.sessao.id,
      //     quantidade: 1
      //   }))
      // };
      // await vendasApi.criarVenda(vendaRequest);

      toast.success('Venda realizada com sucesso!');
      setCarrinho([]);
      setClienteSelecionado(null);
      setSessaoSelecionada(null);
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      toast.error('Erro ao finalizar venda');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Venda de Ingressos">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda - Sessões e Lugares */}
        <div className="lg:col-span-2 space-y-6">
          {/* Barra de Pesquisa */}
          <div className="bg-white p-4 rounded-lg shadow">
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

          {/* Lista de Sessões */}
          <div className="bg-white p-6 rounded-lg shadow">
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
                  <div className="flex justify-between items-start mb-2">
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
                  <p className="text-sm">
                    Sala {sessao.sala.numero} - {sessao.idioma}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seleção de Lugares */}
          {sessaoSelecionada && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Selecione os Lugares</h2>
              <div className="grid grid-cols-10 gap-2">
                {sessaoSelecionada.lugaresDisponiveis.map(lugar => {
                  const estaNoCarrinho = carrinho.some(
                    item => item.sessao.id === sessaoSelecionada.id && item.numeroLugar === lugar
                  );

                  return (
                    <button
                      key={lugar}
                      onClick={() => adicionarAoCarrinho(lugar)}
                      disabled={estaNoCarrinho}
                      className={`
                        p-2 rounded-md text-center
                        ${estaNoCarrinho
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-100 hover:bg-blue-500 hover:text-white'}
                      `}
                    >
                      {lugar}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Coluna da Direita - Carrinho */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Carrinho</h2>
          
          <BuscaCliente onClienteSelect={setClienteSelecionado} />

          {clienteSelecionado && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{clienteSelecionado.nomeCompleto}</p>
              <p className="text-sm text-gray-600">{clienteSelecionado.cpf}</p>
              <p className="text-sm text-blue-800 mt-1">
                Pontos de Fidelidade: {verificarPontosFidelidade(clienteSelecionado.id!)}
              </p>
              {carrinho.length >= 10 && (
                <p className="text-sm text-green-600 mt-1">
                  Você tem direito a um ingresso grátis!
                </p>
              )}
            </div>
          )}

          <div className="divide-y">
            {carrinho.map((item, index) => (
              <div key={`${item.sessao.id}-${item.numeroLugar}`} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{item.sessao.filme.titulo}</h3>
                    <p className="text-sm text-gray-600">
                      Lugar: {item.numeroLugar}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.sessao.dataHora).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(item.sessao.dataHora).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="font-medium">
                      R$ {item.sessao.valorIngresso.toFixed(2)}
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

          <div className="mt-6 pt-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-2xl font-bold">
                R$ {calcularTotal().toFixed(2)}
              </span>
            </div>

            <button
              onClick={finalizarVenda}
              disabled={isLoading || carrinho.length === 0 || !clienteSelecionado}
              className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              {isLoading ? 'Finalizando...' : 'Finalizar Venda'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}