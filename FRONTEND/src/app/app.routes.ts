import { Routes } from '@angular/router';
import { Listagem } from './components/listagem/listagem';
import { Formulario } from './components/formulario/formulario';

export const routes: Routes = [
  { path: '', redirectTo: 'carteirinhas', pathMatch: 'full' },
  { path: 'carteirinhas', component: Listagem },
  { path: 'carteirinhas/nova', component: Formulario },
  { path: 'carteirinhas/:id/editar', component: Formulario },
];