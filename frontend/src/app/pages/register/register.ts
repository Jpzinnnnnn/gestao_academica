import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  tipo: string = 'aluno';

  ra: string = '';
  cpf: string = '';
  email: string = '';
  nome: string = '';
  senha: string = '';
  confirmar: string = '';

  erro: string = '';
  carregando: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || 'aluno';
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }

  irParaLogin() {
    this.router.navigate(['/login'], {
      queryParams: { tipo_usuario: this.tipo }
    });
  }

  registrar(event: Event) {
    event.preventDefault();
    this.erro = '';

    if (!this.nome || !this.email || !this.senha) {
      this.erro = 'Preencha todos os campos!';
      return;
    }

    if (this.tipo === 'aluno' && !this.ra) {
      this.erro = 'Digite o RA do aluno!';
      return;
    }

    if (this.tipo === 'professor' && !this.cpf) {
      this.erro = 'Digite o CPF do professor!';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha precisa ter no mínimo 6 caracteres!';
      return;
    }

    if (this.senha !== this.confirmar) {
      this.erro = 'As senhas não coincidem!';
      return;
    }

    this.carregando = true;

    const body: any = {
      nome: this.nome,
      email: this.email,
      password: this.senha,
      tipo_usuario: this.tipo
    };

    if (this.tipo === 'aluno') {
      body.ra = this.ra;
    }

    if (this.tipo === 'professor') {
      body.cpf = this.cpf;
    }

    this.http.post('http://localhost:3000/register', body).subscribe({
      next: (res: any) => {
        this.carregando = false;
        alert('Registrado com sucesso!');
        
        // VAI PARA HOME CERTA
        this.router.navigate([this.tipo === 'professor' ? '/professor' : '/aluno']);
      },
      error: (err) => {
        this.carregando = false;
        console.error(err);
        this.erro = typeof err.error === 'string' ? err.error : 'Erro ao registrar usuário';
      }
    });
  }

}