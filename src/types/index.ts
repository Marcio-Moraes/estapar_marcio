export interface User {
  id: string;
  nome: string;
  email: string;
  username: string;
  cargo: string;
}

export interface Plan {
  id: string;
  descricao: string;
  valor: number;
  vagas: number;
  ocupadas: number;
  disponiveis: number;
  ativo: boolean;
}

export interface Discount {
  id: string;
  cupom: string;
  descricao: string;
  descontoPercentual: number;
  ativo: boolean;
}

export interface Garage {
  codigo: string;
  nome: string;
  endereco: string;
  cidadeUf: string;
  regional: string;
  ativo: boolean;
  acoes: {
    link: string;
    urlCurta: string;
  };
  vagasTotais: number;
  vagasOcupadas: number;
  vagasDisponiveis: number;
  qrCodeUrl?: string;
  planos: Plan[];
  descontos: Discount[];
}

export interface Mensalista {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  garagemCodigo: string;
  garagemNome: string;
  planoId: string;
  planoDescricao: string;
  ativo: boolean;
}
