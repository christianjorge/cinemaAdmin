import { Usuario, Filme, Sala, Sessao, Produto, Oferta, Fidelidade, Estoque } from '../types';

export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nomeCompleto: 'Administrador',
    email: 'admin@cinema.com',
    senha: '123456',
    dataNascimento: '1990-01-01',
    cpf: '000.000.000-00',
    telefone: '(00) 00000-0000',
    endereco: 'Rua Teste, 123',
    nivelAcesso: 'ADMIN',
    dataCadastro: '2024-01-01',
    status: 'ATIVO'
  },
  // Adicione mais usuários mock aqui
];

export const mockFilmes: Filme[] = [
  {
    id: 1,
    titulo: 'O Poderoso Chefão',
    sinopse: 'Um clássico do cinema sobre a máfia italiana',
    lancamento: '1972-03-14',
    nota: 9.2,
    duracao: 175,
    classificacao: '18',
    generos: ['Crime', 'Drama']
  },
  // Adicione mais filmes mock aqui
];

export const mockSalas: Sala[] = [
  {
    id: 1,
    numero: 1,
    capacidade: 100,
    tipo: 'NORMAL',
    status: 'ATIVA'
  },
  // Adicione mais salas mock aqui
];

export const mockSessoes: Sessao[] = [
  {
    id: 1,
    filme: mockFilmes[0],
    sala: mockSalas[0],
    valorIngresso: 30.0,
    dataHora: '2024-03-14T20:00:00',
    idioma: 'Legendado',
    lugaresDisponiveis: Array.from({ length: 100 }, (_, i) => i + 1)
  },
  // Adicione mais sessões mock aqui
];

export const mockProdutos: Produto[] = [
  {
    id: 1,
    nome: 'Pipoca Grande',
    descricao: 'Pipoca salgada tamanho grande',
    valor: 20.0,
    qtdDisp: 100
  },
  // Adicione mais produtos mock aqui
];

export const mockOfertas: Oferta[] = [
  {
    id: 1,
    produto: mockProdutos[0],
    dataInicio: '2024-03-01',
    dataFim: '2024-03-31',
    descricao: 'Promoção de Março',
    percentualDesconto: 20
  },
  // Adicione mais ofertas mock aqui
];

export const mockFidelidades: Fidelidade[] = [
  {
    id: 1,
    nome: 'Plano Premium',
    valorMensalidade: 49.90,
    pontuacao: 1000,
    dataAdesao: '2024-01-01',
    dataValidade: '2025-01-01',
    status: 'ATIVO',
    usuario: mockUsuarios[0]
  },
  // Adicione mais fidelidades mock aqui
];

export const mockEstoques: Estoque[] = [
  {
    id: 1,
    data: '2024-03-14',
    status: 'DISPONIVEL',
    quantidade: 100,
    preco: 15.0,
    produto: mockProdutos[0]
  },
  // Adicione mais estoques mock aqui
];

// Funções auxiliares para simular operações CRUD
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateId = (array: any[]): number => {
  return Math.max(...array.map(item => item.id || 0)) + 1;
};