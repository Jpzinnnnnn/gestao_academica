import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { Api } from '../../service/api';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})

export class Register {

  tipo = 'aluno'; // 'aluno' ou 'professor' — definido pela landing-page via query param ou state

  ra = '';
  email = '';

  senha = '';
  confirmar = '';

  constructor(
    private router: Router,
    private api: Api
  ) {}

  voltar() {
    this.router.navigate(['/']);
  }

  irParaLogin() {
    this.router.navigate(['/login']);
  }

  async registrar(event: Event) {

    event.preventDefault();

    if (this.senha !== this.confirmar) {
      alert('As senhas não coincidem');
      return;
    }

    try {

      const response: any = await firstValueFrom(
        this.api.register({
          tipo: this.tipo,
          ra: this.ra,
          email: this.email,
          password: this.senha
        })
      );

      alert(response.message || 'Usuário registrado');

      this.router.navigate(['/']);

    } catch (erro: any) {

      console.log(erro);

      alert(
        erro?.error ||
        'Erro ao conectar com servidor'
      );
    }
  }
}
