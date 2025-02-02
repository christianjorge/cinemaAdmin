export type Usuario = {
  id?: number;
  nomeCompleto: string;
  email: string;
  senha: string;
  dataNascimento: string;
  cpf: string;
  telefone: string;
  endereco: string;
  nivelAcesso: 'ADMIN' | 'CLIENTE' | 'FUNCIONARIO';
  dataCadastro?: string;
  status: 'ATIVO' | 'INATIVO';
};

export type AuthResponse = {
  token: string;
  usuario: Usuario;
};

export type Filme = {
  id?: number;
  titulo: string;
  sinopse: string;
  lancamento: string;
  nota: number;
  duracao: number;
  classificacao: string;
  generos: string[];
};

export type Sala = {
  id?: number;
  numero: number;
  capacidade: number;
  tipo: string;
  status: string;
};

export type Sessao = {
  id?: number;
  filme: Filme;
  sala: Sala;
  valorIngresso: number;
  dataHora: string;
  idioma: string;
  lugaresDisponiveis: number[];
};

export type Produto = {
  id?: number;
  nome: string;
  descricao: string;
  valor: number;
  qtdDisp: number;
};

export type Oferta = {
  id?: number;
  produto: Produto;
  dataInicio: string;
  dataFim: string;
  descricao: string;
  percentualDesconto: number;
};

export type Ingresso = {
  id?: number;
  sessao: Sessao;
  numeroLugar: number;
  tipo: string;
  valor: number;
  status: string;
};

export type Fidelidade = {
  id?: number;
  nome: string;
  valorMensalidade: number;
  pontuacao: number;
  dataAdesao: string;
  dataValidade: string;
  status: string;
  usuario: Usuario;
};

export type Estoque = {
  id?: number;
  data: string;
  status: string;
  quantidade: number;
  preco: number;
  produto: Produto;
};