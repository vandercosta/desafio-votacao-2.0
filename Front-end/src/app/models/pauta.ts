export interface IPauta {
  _id: string;
  titulo: string;
  descricao: string;
  categoria: { _id: string; nome: string };
  dataCriacao: string;
  dataExpiracao: string;
  votosSim: number;
  votosNao: number;
  jaVotou: boolean;
}
