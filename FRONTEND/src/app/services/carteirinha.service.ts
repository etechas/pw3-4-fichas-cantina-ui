import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CarteirinhaAluno } from '../models/carteirinha-aluno.model';
import { mensagemDeErro } from '../utils/mensagem-erro';

@Injectable({ providedIn: 'root' })
export class CarteirinhaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/carteirinhas';

  listar(): Observable<CarteirinhaAluno[]> {
    return this.tratar(
      this.http.get<CarteirinhaAluno[]>(this.apiUrl),
      'Não foi possível carregar as carteirinhas.'
    );
  }

  buscarPorId(id: number): Observable<CarteirinhaAluno> {
    return this.tratar(
      this.http.get<CarteirinhaAluno>(`${this.apiUrl}/${id}`),
      'Não foi possível carregar a carteirinha.'
    );
  }

  cadastrar(carteirinha: CarteirinhaAluno): Observable<CarteirinhaAluno> {
    return this.tratar(
      this.http.post<CarteirinhaAluno>(this.apiUrl, carteirinha),
      'Não foi possível cadastrar. Confira os dados.'
    );
  }

  atualizar(id: number, carteirinha: CarteirinhaAluno): Observable<CarteirinhaAluno> {
    return this.tratar(
      this.http.put<CarteirinhaAluno>(`${this.apiUrl}/${id}`, carteirinha),
      'Não foi possível atualizar. Confira os dados.'
    );
  }

  excluir(id: number): Observable<void> {
    return this.tratar(
      this.http.delete<void>(`${this.apiUrl}/${id}/excluir`),
      'Não foi possível excluir a carteirinha.'
    );
  }

  bloquear(id: number): Observable<void> {
    return this.tratar(
      this.http.put<void>(`${this.apiUrl}/${id}/bloquear`, {}),
      'Não foi possível bloquear a carteirinha.'
    );
  }

  desbloquear(id: number): Observable<CarteirinhaAluno> {
    return this.tratar(
      this.http.put<CarteirinhaAluno>(`${this.apiUrl}/${id}/desbloquear`, {}),
      'Não foi possível desbloquear a carteirinha.'
    );
  }

  debitar(id: number, valor: number): Observable<CarteirinhaAluno> {
    const params = new HttpParams().set('valor', valor);
    return this.tratar(
      this.http.post<CarteirinhaAluno>(`${this.apiUrl}/${id}/debitar`, {}, { params }),
      'Não foi possível debitar.'
    );
  }

  recarregar(id: number, valor: number): Observable<CarteirinhaAluno> {
    const params = new HttpParams().set('valor', valor);
    return this.tratar(
      this.http.post<CarteirinhaAluno>(`${this.apiUrl}/${id}/recarregar`, {}, { params }),
      'Não foi possível recarregar.'
    );
  }

  // Captura o erro HTTP (400, 409, 500...) e devolve um erro com a mensagem amigável
  private tratar<T>(requisicao: Observable<T>, mensagemPadrao: string): Observable<T> {
    return requisicao.pipe(
      catchError((e: HttpErrorResponse) =>
        throwError(() => new Error(mensagemDeErro(e, mensagemPadrao)))
      )
    );
  }
}