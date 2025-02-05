import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Search, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import { BuscaCliente } from './components/BuscaCliente';
import { Usuario, Produto, Oferta } from '../../types';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
  oferta?: Oferta;
};

export function VendaProdutos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Usuario | null>(null);
  const [isLoadingProdutos, setIsLoadingProdutos] = useState(false);
  const [isLoadingOfertas, setIsLoadingOfertas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    carregarProdutos();
    carregarOfertas();
  }, []);

  const carregarProdutos = async () => {
    setIsLoadingProdutos(true);
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      //toast.error('Erro ao carregar produtos');
    } finally {
      setIsLoadingProdutos(false);
    }
  };

  const carregarOfertas = async () => {
    setIsLoadingOfertas(true);
    try {
      const response = await api.get('/oferta');
      setOfertas(response.data);
    } catch (error) {
      console.error('Erro ao carregar ofertas:', error);
      toast.error('Erro ao carregar ofertas');
    } finally {
      setIsLoadingOfertas(false);
    }
  };

  const produtosFiltrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ofertasAtivas = ofertas.filter(oferta => {
    const hoje = new Date();
    const inicio = new Date(oferta.dataInicio);
    const fim = new Date(oferta.dataFim);
    return hoje >= inicio && hoje <= fim;
  });

  const adicionarAoCarrinho = (produto: Produto, oferta?: Oferta) => {
    setCarrinho(prev => {
      const itemExistente = prev.find(item => 
        item.produto.id === produto.id && 
        (!item.oferta && !oferta || item.oferta?.id === oferta?.id)
      );

      if (itemExistente) {
        return prev.map(item => 
          item === itemExistente
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...prev, { produto, quantidade: 1, oferta }];
    });
  };

  const removerDoCarrinho = (index: number) => {
    setCarrinho(prev => prev.filter((_, i) => i !== index));
  };

  const atualizarQuantidade = (index: number, quantidade: number) => {
    if (quantidade < 1) return;
    
    setCarrinho(prev => prev.map((item, i) => 
      i === index ? { ...item, quantidade } : item
    ));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const precoBase = item.produto.valor * item.quantidade;
      if (item.oferta) {
        const desconto = precoBase * (item.oferta.percentualDesconto / 100);
        return total + (precoBase - desconto);
      }
      return total + precoBase;
    }, 0);
  };

  const finalizarVenda = async () => {
    if (!clienteSelecionado) {
      toast.error('Selecione um cliente para continuar');
      return;
    }

    if (carrinho.length === 0) {
      toast.error('Adicione produtos ao carrinho');
      return;
    }

    setIsLoading(true);
    try {
      toast.success('Venda realizada com sucesso!');
      setCarrinho([]);
      setClienteSelecionado(null);
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      //toast.error('Erro ao finalizar venda');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProdutos || isLoadingOfertas) {
    return (
      <Layout title="Venda de Produtos">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Venda de Produtos">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna da Esquerda - Produtos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Barra de Pesquisa */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar produtos..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Lista de Produtos */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Produtos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {produtosFiltrados.map(produto => {
                const ofertasDisponiveis = ofertasAtivas.filter(
                  oferta => oferta.produto.id === produto.id
                );

                return (
                  <div
                    key={produto.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
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

                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Adicionar
                      </button>

                      {ofertasDisponiveis.map(oferta => (
                        <button
                          key={oferta.id}
                          onClick={() => adicionarAoCarrinho(produto, oferta)}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
                        >
                          <Tag className="w-4 h-4" />
                          {oferta.percentualDesconto}% OFF
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna da Direita - Carrinho */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Carrinho</h2>
          
          <BuscaCliente onClienteSelect={setClienteSelecionado} />

          {clienteSelecionado && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium">{clienteSelecionado.nomeCompleto}</p>
              <p className="text-sm text-gray-600">{clienteSelecionado.cpf}</p>
            </div>
          )}

          <div className="divide-y">
            {carrinho.map((item, index) => (
              <div key={`${item.produto.id}-${item.oferta?.id}`} className="py-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{item.produto.nome}</h3>
                    {item.oferta && (
                      <span className="text-sm text-green-600">
                        {item.oferta.percentualDesconto}% OFF
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removerDoCarrinho(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
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

                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.quantidade} x R$ {item.produto.valor.toFixed(2)}
                    </p>
                    {item.oferta && (
                      <p className="text-sm text-green-600">
                        Desconto: R$ {(
                          item.produto.valor *
                          item.quantidade *
                          (item.oferta.percentualDesconto / 100)
                        ).toFixed(2)}
                      </p>
                    )}
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
              className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Finalizando...' : 'Finalizar Venda'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}