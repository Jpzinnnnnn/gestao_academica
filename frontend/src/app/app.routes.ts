import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { LandingPage } from './pages/landing-page/landing-page';

export const routes: Routes = [

  { path: '', component: LandingPage },

  { path: 'login', component: Login },

  { path: 'register', component: Register },

  { path: 'home', component: Home },

  { path: '**', redirectTo: '' }

];