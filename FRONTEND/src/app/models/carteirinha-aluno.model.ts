export type StatusCarteirinha = 'ATIVA' | 'BLOQUEADA';

export interface CarteirinhaAluno {
  id?: number;
  nome: string;
  matricula: string;
  saldo: number;
  status: StatusCarteirinha;
}