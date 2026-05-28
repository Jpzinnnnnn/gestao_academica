import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // ✅ adicionado

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule], // ✅ HttpClient não vai aqui, vai no app.config.ts
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {

  tipo: string = 'aluno';
  ra: string = '';
  email: string = '';
  nome: string = '';
  senha: string = '';
  confirmar: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient // ✅ injetado
  ) {
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || 'aluno';
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }

  registrar(event: Event) {
    event.preventDefault();

    // ✅ Validação de senhas
    if (this.senha !== this.confirmar) {
      alert('As senhas não coincidem!');
      return;
    }

    if (!this.nome || !this.email || !this.senha) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }

    // ✅ Monta o body que o backend espera
    const body: any = {
      nome: this.nome,
      email: this.email,
      password: this.senha,       // backend espera "password"
      tipo_usuario: this.tipo
    };

    if (this.tipo === 'aluno') {
      body.ra = this.ra;
    }

    // ✅ Chama o backend
    this.http.post('http://localhost:3000/register', body).subscribe({
      next: (res: any) => {
        alert('Registrado com sucesso!');
        this.router.navigate(['/login'], {
          queryParams: { tipo_usuario: this.tipo }
        });
      },
      error: (err) => {
        const mensagem = typeof err.error === 'string' ? err.error : 'Erro desconhecido';
        alert('Erro ao registrar: ' + mensagem);
        console.error(err);
      }
    });
  }

  irParaLogin() {
    this.router.navigate(['/login'], {
      queryParams: { tipo_usuario: this.tipo }
    });
  }

}