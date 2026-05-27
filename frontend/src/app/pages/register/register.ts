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

  tipo = 'aluno';

  nome = '';
  email = '';
  ra = '';

  curso = '';
  turma = '';

  cpf = '';
  especialidade = '';

  senha = '';
  confirmar = '';

  constructor(
    private router: Router,
    private api: Api
  ) {}

  async registrar(event: Event) {

    event.preventDefault();

    if (this.senha !== this.confirmar) {

      alert('As senhas não coincidem');
      return;

    }

    try {

      const response: any = await firstValueFrom(

        this.api.register({

          tipo_usuario: this.tipo,

          nome: this.nome,
          email: this.email,
          ra: this.ra,

          curso: this.curso,
          turma: this.turma,

          cpf: this.cpf,
          especialidade: this.especialidade,

          password: this.senha

        })
      );

      alert(
        response.message ||
        'Usuário registrado com sucesso'
      );

      this.router.navigate(['/landing-page']);

    } catch (erro: any) {

      console.log(erro);

      alert(
        erro?.error ||
        'Erro ao conectar com servidor'
      );
    }
  }
}