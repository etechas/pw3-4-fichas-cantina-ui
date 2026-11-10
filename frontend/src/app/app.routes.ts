import { Routes } from '@angular/router';
import { Formulario } from './components/formulario/formulario';
import { Listagem } from './components/listagem/listagem';

export const routes: Routes = [
  { path: '', component: Listagem, pathMatch: 'full' },
  { path: 'nova', component: Formulario },
  { path: 'editar/:id', component: Formulario },
  { path: '**', redirectTo: '' },
];
