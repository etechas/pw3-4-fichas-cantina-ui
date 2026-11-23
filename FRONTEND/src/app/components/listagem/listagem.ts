import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarteirinhaService } from '../../services/carteirinha.service';
import { CarteirinhaAluno } from '../../models/carteirinha-aluno.model';

@Component({
  selector: 'app-listagem',
  imports: [RouterLink],
  templateUrl: './listagem.html',
  styleUrl: './listagem.css',
})
export class Listagem implements OnInit {
  private service = inject(CarteirinhaService);

  carteirinhas = signal<CarteirinhaAluno[]>([]);
  erro = signal<string | null>(null);
  sucesso = signal<string | null>(null);

  private temporizador?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe({
      next: (dados) => this.carteirinhas.set(dados),
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  debitar(c: CarteirinhaAluno) {
    const valor = this.pedirValor('debitar');
    if (valor === null) return;

    this.service.debitar(c.id!, valor).subscribe({
      next: () => this.aposAcao(),
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  recarregar(c: CarteirinhaAluno) {
    const valor = this.pedirValor('recarregar');
    if (valor === null) return;

    this.service.recarregar(c.id!, valor).subscribe({
      next: () => this.aposAcao(),
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  bloquear(c: CarteirinhaAluno) {
    this.service.bloquear(c.id!).subscribe({
      next: () => this.aposAcao(),
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  desbloquear(c: CarteirinhaAluno) {
    this.service.desbloquear(c.id!).subscribe({
      next: () => this.aposAcao(),
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  excluir(c: CarteirinhaAluno) {
    if (!confirm(`Deseja excluir a carteirinha de ${c.nome}?`)) return;

    this.service.excluir(c.id!).subscribe({
      next: () => this.aposAcao(),
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  private aposAcao() {
    this.carregar();
    this.mostrarMensagem('Operação realizada com sucesso!', 'sucesso');
  }

  private pedirValor(acao: string): number | null {
    const texto = prompt(`Valor para ${acao}:`);
    if (!texto) return null;

    const valor = Number(texto.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      this.mostrarMensagem('Digite um valor válido, maior que zero.', 'erro');
      return null;
    }
    return valor;
  }

  private mostrarMensagem(texto: string, tipo: 'erro' | 'sucesso') {
    clearTimeout(this.temporizador);
    this.erro.set(tipo === 'erro' ? texto : null);
    this.sucesso.set(tipo === 'sucesso' ? texto : null);
    this.temporizador = setTimeout(() => {
      this.erro.set(null);
      this.sucesso.set(null);
    }, 5000);
  }
}