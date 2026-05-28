import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  login: string = '';
  senha: string = '';
  tipo: string = 'aluno';
  erro: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo_usuario'] || 'aluno';
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }

  fazerLogin() {
    this.erro = '';

    if (!this.login || !this.senha) {
      this.erro = 'Preencha todos os campos!';
      return;
    }

    const body = {
      login: this.login,           // ✅ RA ou email dependendo do tipo
      password: this.senha,
      tipo_usuario: this.tipo      // ✅ envia o tipo para o backend saber como buscar
    };

    console.log('📤 Enviando login:', body);

    this.http.post('http://localhost:3000/login', body).subscribe({
      next: (res: any) => {
        console.log('✅ Login ok:', res);
        localStorage.setItem('usuario', JSON.stringify(res.user));
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('❌ Erro:', err);
        const msg = typeof err.error === 'string' ? err.error : 'Login ou senha incorretos';
        this.erro = msg;
      }
    });
  }

  irParaRegistro() {
    this.router.navigate(['/register'], {
      queryParams: { tipo: this.tipo }
    });
  }

}