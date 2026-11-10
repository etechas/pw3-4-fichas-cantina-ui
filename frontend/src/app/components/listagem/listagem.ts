import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarteirinhaAluno } from '../../models/carteirinha.model';
import { CarteirinhaService } from '../../services/carteirinha.service';

@Component({
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './listagem.html',
})
export class Listagem implements OnInit {
  private readonly service = inject(CarteirinhaService);
  readonly carteirinhas = signal<CarteirinhaAluno[]>([]);
  readonly carregando = signal(true);
  readonly pendente = signal(false);
  readonly erro = signal('');
  readonly aviso = signal('');

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: dados => {
        this.carteirinhas.set(dados);
        this.carregando.set(false);
      },
      error: erro => {
        this.erro.set(this.service.mensagemDeErro(erro));
        this.carregando.set(false);
      },
    });
  }

  excluir(carteirinha: CarteirinhaAluno): void {
    if (!window.confirm(`Excluir a carteirinha de ${carteirinha.nomeAluno}?`)) return;

    this.iniciarOperacao();
    this.service.excluir(carteirinha.id).subscribe({
      next: () => {
        this.carteirinhas.update(itens => itens.filter(item => item.id !== carteirinha.id));
        this.aviso.set('Carteirinha excluída.');
        this.pendente.set(false);
      },
      error: erro => {
        this.erro.set(this.service.mensagemDeErro(erro));
        this.pendente.set(false);
      },
    });
  }

  operar(id: number, operacao: 'debitar' | 'recarregar', campo: HTMLInputElement): void {
    this.erro.set('');
    this.aviso.set('');
    if (!campo.reportValidity()) return;

    this.iniciarOperacao();
    this.service.executarRegra(id, operacao, campo.valueAsNumber).subscribe({
      next: atualizada => {
        this.carteirinhas.update(itens => itens.map(item => item.id === id ? atualizada : item));
        campo.value = '';
        this.aviso.set(operacao === 'debitar' ? 'Débito realizado.' : 'Recarga realizada.');
        this.pendente.set(false);
      },
      error: erro => {
        this.erro.set(this.service.mensagemDeErro(erro));
        this.pendente.set(false);
      },
    });
  }

  private iniciarOperacao(): void {
    this.erro.set('');
    this.aviso.set('');
    this.pendente.set(true);
  }
}
