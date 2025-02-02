export type ItemVenda = {
  id?: number;
  produto?: {
    id: number;
    nome: string;
    valor: number;
  };
  ingresso?: {
    id: number;
    sessao: {
      id: number;
      filme: {
        titulo: string;
      };
      dataHora: string;
      valorIngresso: number;
    };
    numeroLugar: number;
  };
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  oferta?: {
    id: number;
    percentualDesconto: number;
  };
};

export type Venda = {
  id?: number;
  usuario: {
    id: number;
    nomeCompleto: string;
    cpf: string;
  };
  itens: ItemVenda[];
  dataVenda: string;
  valorTotal: number;
};

export type ItemVendaRequest = {
  produtoId?: number;
  ingressoId?: number;
  quantidade: number;
  ofertaId?: number;
};

export type VendaRequest = {
  usuarioId: number;
  itens: ItemVendaRequest[];
};