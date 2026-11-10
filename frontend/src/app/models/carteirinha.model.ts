export type StatusCarteirinha = 'ATIVA' | 'BLOQUEADA';

export interface CarteirinhaAluno {
  id: number;
  nomeAluno: string;
  matricula: string;
  saldo: number;
  status: StatusCarteirinha;
}

export type CadastroCarteirinha = Pick<CarteirinhaAluno, 'nomeAluno' | 'matricula' | 'status'>;
