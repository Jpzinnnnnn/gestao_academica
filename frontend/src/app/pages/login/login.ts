import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
    private route: ActivatedRoute,
    private http: HttpClient
  ) {

    this.route.queryParams.subscribe(params => {
      this.tipo = (params['tipo'] || 'aluno').toString().toLowerCase() === 'professor' ? 'professor' : 'aluno';
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

    const loginField = this.ra.trim();
    const senha = this.senha.trim();

    if (!loginField) {
      this.erroRa = true;
    }

    if (!senha) {
      this.erroSenha = true;
    }

    if (this.erroRa || this.erroSenha) {
      return;
    }

    // CHAMADA À API REAL
    this.http.post('http://localhost:3000/login', {
      login: loginField,
      password: senha,
      tipo_usuario: this.tipo
    }).subscribe({
      next: (res: any) => {
        
        localStorage.setItem(
          'sessao_usuario',
          JSON.stringify({
            id: res.user.id,
            nome: res.user.nome,
            email: res.user.email,
            ra: res.user.ra,
            tipo: res.user.tipo_usuario
          })
        );

        if (res.user.tipo_usuario === 'professor' || res.user.tipo_usuario === 'admin') {
          this.router.navigate(['/professor']);
        } else {
          this.router.navigate(['/aluno']);
        }

      },
      error: (err) => {
        console.error(err);
        alert(err.error || 'Credenciais inválidas');
      }
    });

  }

  irParaRegistro() {
    this.router.navigate(['/register'], {
      queryParams: { tipo: this.tipo }
    });
  }

}