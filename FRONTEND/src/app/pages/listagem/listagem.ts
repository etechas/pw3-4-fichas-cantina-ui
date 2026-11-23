import { Component, OnInit, inject, signal } from '@angular/core';
import { CarteirinhaService } from '../../services/carteirinha';
import { CarteirinhaAluno } from '../../models/carteirinha-aluno';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-listagem',
  imports: [RouterLink],
  templateUrl: './listagem.html',
  styleUrl: './listagem.css',
})
export class Listagem implements OnInit {
  private service = inject(CarteirinhaService);

  carteirinhas = signal<CarteirinhaAluno[]>([]);

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.service.listar().subscribe({
      next: (dados) => this.carteirinhas.set(dados),
      error: (erro) => console.log('Erro ao carregar:', erro),
    });
  }

  debitar(c: CarteirinhaAluno) {
    const valor = this.pedirValor('debitar');
    if (valor === null) return;

    this.service.debitar(c.id!, valor).subscribe({
      next: () => this.carregar(),
      error: () => alert('Não foi possível debitar. Verifique o saldo e o status da carteirinha.'),
    });
  }

  recarregar(c: CarteirinhaAluno) {
    const valor = this.pedirValor('recarregar');
    if (valor === null) return;

    this.service.recarregar(c.id!, valor).subscribe({
      next: () => this.carregar(),
      error: () => alert('Não foi possível recarregar. Verifique o status da carteirinha.'),
    });
  }

  bloquear(c: CarteirinhaAluno) {
    this.service.bloquear(c.id!).subscribe({
      next: () => this.carregar(),
      error: () => alert('Não foi possível bloquear a carteirinha.'),
    });
  }

  desbloquear(c: CarteirinhaAluno) {
    this.service.desbloquear(c.id!).subscribe({
      next: () => this.carregar(),
      error: () => alert('Não foi possível desbloquear a carteirinha.'),
    });
  }

  excluir(c: CarteirinhaAluno) {
    if (!confirm(`Deseja excluir a carteirinha de ${c.nome}?`)) return;

    this.service.excluir(c.id!).subscribe({
      next: () => this.carregar(),
      error: () => alert('Não foi possível excluir a carteirinha.'),
    });
  }

  private pedirValor(acao: string): number | null {
    const texto = prompt(`Valor para ${acao}:`);
    if (!texto) return null;

    const valor = Number(texto.replace(',', '.'));
    if (isNaN(valor) || valor <= 0) {
      alert('Digite um valor válido, maior que zero.');
      return null;
    }
    return valor;
  }
}