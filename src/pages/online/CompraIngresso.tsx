import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { mockSessoes } from '../../services/mockData';
import { Sessao } from '../../types';
import { api } from '../../services/api';

export function CompraIngresso() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);
  const [lugarSelecionado, setLugarSelecionado] = useState<number | null>(null);
  const [cpf, setCpf] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reservaId, setReservaId] = useState<string | null>(null);
  const [reservaTimeout, setReservaTimeout] = useState<NodeJS.Timeout | null>(null);
  const [tempoRestante, setTempoRestante] = useState<number>(0);

  useEffect(() => {
    // Carrega sessões e verifica lugares já reservados/vendidos
    const carregarSessoes = async () => {
      try {
        // TODO: Integrar com API
        // const response = await api.get('/sessoes');
        // setSessoes(response.data);
        setSessoes(mockSessoes);
      } catch (error) {
        toast.error('Erro ao carregar sessões');
      }
    };

    carregarSessoes();
    
    // Polling para atualizar status dos lugares a cada 30 segundos
    const polling = setInterval(carregarSessoes, 30000);
    
    return () => {
      clearInterval(polling);
      if (reservaTimeout) {
        clearTimeout(reservaTimeout);
      }
    };
  }, []);

  // Contador regressivo para expiração da reserva
  useEffect(() => {
    if (tempoRestante > 0) {
      const timer = setInterval(() => {
        setTempoRestante(prev => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [tempoRestante]);

  const reservarLugar = async (lugar: number) => {
    if (!sessaoSelecionada) return;

    try {
      setIsLoading(true);
      // TODO: Integrar com API
      // const response = await api.post('/reservas', {
      //   sessaoId: sessaoSelecionada.id,
      //   lugar,
      // });
      // const { reservaId, expiraEm } = response.data;
      
      // Mock da reserva
      const mockReservaId = `${Date.now()}-${lugar}`;
      const expiraEm = 600; // 10 minutos em segundos

      // Limpa reserva anterior se existir
      if (reservaTimeout) {
        clearTimeout(reservaTimeout);
        await cancelarReserva();
      }

      // Configura nova reserva
      setReservaId(mockReservaId);
      setLugarSelecionado(lugar);
      setTempoRestante(expiraEm);

      // Configura timeout para expiração
      const timeout = setTimeout(async () => {
        await cancelarReserva();
        setLugarSelecionado(null);
        setReservaId(null);
        setTempoRestante(0);
        toast.error('Reserva expirada! Por favor, selecione o lugar novamente.');
      }, expiraEm * 1000);

      setReservaTimeout(timeout);
    } catch (error) {
      toast.error('Este lugar já está reservado. Por favor, escolha outro.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarReserva = async () => {
    if (!reservaId) return;

    try {
      // TODO: Integrar com API
      // await api.delete(`/reservas/${reservaId}`);
      
      setReservaId(null);
      setTempoRestante(0);
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
    }
  };

  const finalizarCompra = async () => {
    if (!sessaoSelecionada || !lugarSelecionado || !cpf || !reservaId) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Integrar com API
      // await api.post('/vendas/ingressos', {
      //   reservaId,
      //   cpf,
      //   sessaoId: sessaoSelecionada.id,
      //   lugar: lugarSelecionado
      // });

      if (reservaTimeout) {
        clearTimeout(reservaTimeout);
      }

      toast.success('Compra realizada com sucesso! Verifique seu email.');
      setSessaoSelecionada(null);
      setLugarSelecionado(null);
      setCpf('');
      setReservaId(null);
      setTempoRestante(0);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Este lugar não está mais disponível. Por favor, escolha outro.');
        setLugarSelecionado(null);
        setReservaId(null);
        setTempoRestante(0);
      } else {
        toast.error('Erro ao finalizar compra. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Formata o tempo restante para exibição
  const formatarTempoRestante = () => {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const sessoesFiltradas = sessoes.filter(sessao =>
    sessao.filme.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Cinema Online</h1>
          <p className="mt-2 text-blue-100">Compre seus ingressos sem sair de casa</p>
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
            {/* Lista de Sessões */}
            <div className="lg:col-span-2">
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
            </div>

            {/* Seleção de Lugar e Finalização */}
            <div className="space-y-6">
              {sessaoSelecionada && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Selecione seu Lugar</h2>
                  <div className="grid grid-cols-8 gap-2">
                    {sessaoSelecionada.lugaresDisponiveis.map(lugar => (
                      <button
                        key={lugar}
                        onClick={() => reservarLugar(lugar)}
                        disabled={lugarSelecionado === lugar}
                        className={`
                          p-2 rounded-md text-center text-sm
                          ${lugarSelecionado === lugar
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-blue-100'}
                        `}
                      >
                        {lugar}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {lugarSelecionado && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Finalizar Compra</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Digite seu CPF"
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900">Resumo da Compra</h3>
                      <div className="mt-2 space-y-1 text-sm text-blue-800">
                        <p>Filme: {sessaoSelecionada?.filme.titulo}</p>
                        <p>Sessão: {new Date(sessaoSelecionada?.dataHora || '').toLocaleString()}</p>
                        <p>Lugar: {lugarSelecionado}</p>
                        <p className="font-medium">
                          Total: R$ {sessaoSelecionada?.valorIngresso.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={finalizarCompra}
                      disabled={isLoading || !cpf}
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}