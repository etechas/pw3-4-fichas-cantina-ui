import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarteirinhaAluno } from '../models/carteirinha-aluno';

@Injectable({ providedIn: 'root' })
export class CarteirinhaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/carteirinhas';

  listar(): Observable<CarteirinhaAluno[]> {
    return this.http.get<CarteirinhaAluno[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<CarteirinhaAluno> {
    return this.http.get<CarteirinhaAluno>(`${this.apiUrl}/${id}`);
  }

  cadastrar(carteirinha: CarteirinhaAluno): Observable<CarteirinhaAluno> {
    return this.http.post<CarteirinhaAluno>(this.apiUrl, carteirinha);
  }

  atualizar(id: number, carteirinha: CarteirinhaAluno): Observable<CarteirinhaAluno> {
    return this.http.put<CarteirinhaAluno>(`${this.apiUrl}/${id}`, carteirinha);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/excluir`);
  }

  bloquear(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/bloquear`, {});
  }

  desbloquear(id: number): Observable<CarteirinhaAluno> {
    return this.http.put<CarteirinhaAluno>(`${this.apiUrl}/${id}/desbloquear`, {});
  }

  debitar(id: number, valor: number): Observable<CarteirinhaAluno> {
    const params = new HttpParams().set('valor', valor);
    return this.http.post<CarteirinhaAluno>(`${this.apiUrl}/${id}/debitar`, {}, { params });
  }

  recarregar(id: number, valor: number): Observable<CarteirinhaAluno> {
    const params = new HttpParams().set('valor', valor);
    return this.http.post<CarteirinhaAluno>(`${this.apiUrl}/${id}/recarregar`, {}, { params });
  }
}