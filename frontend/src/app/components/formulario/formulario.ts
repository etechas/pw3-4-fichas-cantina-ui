import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StatusCarteirinha } from '../../models/carteirinha.model';
import { CarteirinhaService } from '../../services/carteirinha.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulario.html',
})
export class Formulario implements OnInit {
  private readonly service = inject(CarteirinhaService);
  private readonly router = inject(Router);
  private readonly rota = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder).nonNullable;

  readonly id = this.rota.snapshot.paramMap.get('id');
  readonly pronto = signal(this.id === null);
  readonly salvando = signal(false);
  readonly erro = signal('');

  readonly form = this.fb.group({
    nomeAluno: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
    matricula: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
    status: this.fb.control<StatusCarteirinha>('ATIVA', Validators.required),
    saldo: [0, [
      Validators.required,
      Validators.min(0),
      Validators.max(9999999999.99),
      Validators.pattern(/^\d+(\.\d{1,2})?$/),
    ]],
  });

  ngOnInit(): void {
    if (this.id === null) return;

    this.form.controls.saldo.disable();
    this.service.buscarPorId(Number(this.id)).subscribe({
      next: dados => {
        this.form.patchValue(dados);
        this.pronto.set(true);
      },
      error: erro => this.erro.set(this.service.mensagemDeErro(erro)),
    });
  }

  salvar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || !this.pronto() || this.salvando()) return;

    this.erro.set('');
    this.salvando.set(true);
    const { nomeAluno, matricula, status, saldo } = this.form.getRawValue();
    const cadastro = { nomeAluno: nomeAluno.trim(), matricula: matricula.trim(), status };
    const requisicao = this.id === null
      ? this.service.cadastrar({ ...cadastro, saldo })
      : this.service.atualizar(Number(this.id), cadastro);

    requisicao.subscribe({
      next: () => void this.router.navigateByUrl('/'),
      error: erro => {
        this.erro.set(this.service.mensagemDeErro(erro));
        this.salvando.set(false);
      },
    });
  }
}
