import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // REGISTER
  register(data: any) {
    return this.http.post(`${this.url}/register`, data);
  }

  // LOGIN
  login(data: any) {
    return this.http.post(`${this.url}/login`, data);
  }

  // BUSCAR USUÁRIO
  getUser(id: number) {
    return this.http.get(`${this.url}/user/${id}`);
  }

  // LOGOUT
  logout() {
    localStorage.removeItem('sessao_usuario');
  }

  // USUÁRIO LOGADO
  getUsuarioLogado() {
    const sessao = localStorage.getItem('sessao_usuario');

    if (!sessao) {
      return null;
    }

    return JSON.parse(sessao);
  }
} 