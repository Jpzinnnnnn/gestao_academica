import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  ra = '';
  senha = '';
  tipo = 'aluno';

  mostrarSenha = false;

  erroRa = false;
  erroSenha = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.queryParams.subscribe(params => {

      this.tipo =
        (params['tipo'] || 'aluno')
          .toString()
          .toLowerCase() === 'professor'
          ? 'professor'
          : 'aluno';

    });

  }

  voltar() {
    this.router.navigate(['/']);
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  login() {

    this.erroRa = false;
    this.erroSenha = false;

    const ra = this.ra.trim().toLowerCase();
    const senha = this.senha.trim();

    if (!ra) {
      this.erroRa = true;
    }

    if (!senha) {
      this.erroSenha = true;
    }

    if (this.erroRa || this.erroSenha) {
      return;
    }

    // ADMIN

    if (ra === 'admin' && senha === 'admin123') {

      localStorage.setItem(
        'sessao_usuario',
        JSON.stringify({
          ra: 'admin',
          tipo: 'admin',
          nome: 'Administrador'
        })
      );

      this.router.navigate(['/professor']);
      return;
    }

    // ALUNO

    if (this.tipo === 'aluno') {

      if (
        ra === 'aluno1' &&
        senha === 'aluno123'
      ) {

        localStorage.setItem(
          'sessao_usuario',
          JSON.stringify({
            ra: 'aluno1',
            tipo: 'aluno',
            nome: 'Aluno'
          })
        );

        this.router.navigate(['/aluno']);
        return;
      }

      alert('Credenciais de aluno inválidas.');
      return;
    }

    // PROFESSOR

    if (this.tipo === 'professor') {

      if (
        ra === 'professor1' &&
        senha === 'prof123'
      ) {

        localStorage.setItem(
          'sessao_usuario',
          JSON.stringify({
            ra: 'professor1',
            tipo: 'professor',
            nome: 'Professor'
          })
        );

        this.router.navigate(['/professor']);
        return;
      }

      alert('Credenciais de professor inválidas.');
      return;
    }

  }

  irParaRegistro() {

    this.router.navigate(
      ['/register'],
      {
        queryParams: {
          tipo: this.tipo
        }
      }
    );

  }

}
