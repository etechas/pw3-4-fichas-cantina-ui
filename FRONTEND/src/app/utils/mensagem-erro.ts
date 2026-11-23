import { HttpErrorResponse } from '@angular/common/http';

export function mensagemDeErro(erro: HttpErrorResponse, padrao: string): string {
  if (erro.status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  }
  return erro.error?.message || padrao;
}