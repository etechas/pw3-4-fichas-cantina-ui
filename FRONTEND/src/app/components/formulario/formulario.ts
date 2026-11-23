import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarteirinhaService } from '../../services/carteirinha.service';
import { StatusCarteirinha } from '../../models/carteirinha-aluno.model';

@Component({
  selector: 'app-formulario',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})
export class Formulario implements OnInit {
  private service = inject(CarteirinhaService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id: number | null = null;

  mensagem = signal<{ texto: string; tipo: 'sucesso' | 'erro' } | null>(null);

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    matricula: ['', Validators.required],
    saldo: [0, [Validators.required, Validators.min(0)]],
    status: ['ATIVA' as StatusCarteirinha],
  });

  constructor() {
    this.form.controls.status.disable();
  }

  ngOnInit() {
    const idDaRota = this.route.snapshot.paramMap.get('id');
    if (idDaRota) {
      this.id = Number(idDaRota);
      this.form.controls.saldo.disable();
      this.service.buscarPorId(this.id).subscribe({
        next: (carteirinha) => this.form.patchValue(carteirinha),
        error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
      });
    }
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dados = this.form.getRawValue();
    const requisicao = this.id
      ? this.service.atualizar(this.id, dados)
      : this.service.cadastrar(dados);

    requisicao.subscribe({
      next: () => {
        this.mostrarMensagem('Carteirinha salva com sucesso!', 'sucesso');
        setTimeout(() => this.router.navigate(['/carteirinhas']), 1200);
      },
      error: (e: Error) => this.mostrarMensagem(e.message, 'erro'),
    });
  }

  private mostrarMensagem(texto: string, tipo: 'sucesso' | 'erro') {
    this.mensagem.set({ texto, tipo });
  }
}