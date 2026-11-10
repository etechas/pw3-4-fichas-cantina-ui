import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CadastroCarteirinha, CarteirinhaAluno } from '../models/carteirinha.model';

@Injectable({ providedIn: 'root' })
export class CarteirinhaService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:8080/api/carteirinhas';

  listar() {
    return this.http.get<CarteirinhaAluno[]>(this.url);
  }

  buscarPorId(id: number) {
    return this.http.get<CarteirinhaAluno>(`${this.url}/${id}`);
  }

  cadastrar(dados: CadastroCarteirinha & { saldo: number }) {
    return this.http.post<CarteirinhaAluno>(this.url, dados);
  }

  atualizar(id: number, dados: CadastroCarteirinha) {
    return this.http.put<CarteirinhaAluno>(`${this.url}/${id}`, dados);
  }

  excluir(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  executarRegra(id: number, operacao: 'debitar' | 'recarregar', valor: number) {
    return this.http.post<CarteirinhaAluno>(`${this.url}/${id}/${operacao}`, { valor });
  }

  mensagemDeErro(erro: HttpErrorResponse): string {
    if (erro.status === 0) {
      return 'Não foi possível conectar à API. Verifique se o Spring Boot está rodando.';
    }
    return erro.error?.mensagem || 'Não foi possível concluir a operação.';
  }
}
