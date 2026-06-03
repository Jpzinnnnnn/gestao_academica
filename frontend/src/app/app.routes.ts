

import { Routes } from '@angular/router';

import { LandingPage } from './pages/landing-page/landing-page';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';

import { HomeAluno } from './pages/home-aluno/home-aluno';
import { HomeProfessor } from './pages/home-professor/home-professor';

import { NotFound } from './pages/not-found/not-found';
import { TesteRetorno } from './pages/teste-retorno/teste-retorno';

export const routes: Routes = [

  // LANDING
  {
    path: '',
    component: LandingPage
  },

  // LOGIN
  {
    path: 'login',
    component: Login
  },

  // REGISTER
  {
    path: 'register',
    component: Register
  },

  // HOME ALUNO
  {
    path: 'aluno',
    component: HomeAluno
  },

  // HOME PROFESSOR
  {
    path: 'professor',
    component: HomeProfessor
  },
  {
    path: 'teste-retorno',
    component: TesteRetorno
  },

  // 404
  {
    path: '**',
    component: NotFound
  }



];