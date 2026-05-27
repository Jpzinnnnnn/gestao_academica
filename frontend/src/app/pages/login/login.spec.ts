import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  ra: string = '';
  senha: string = '';

  tipo = 'aluno';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || 'aluno';
    });

  }

  voltar() {
    this.router.navigate(['/']);
  }

  login() {

    console.log('RA:', this.ra);
    console.log('Senha:', this.senha);

    alert('Login realizado!');

    this.router.navigate(['/home']);

  }

  irParaRegistro() {

    this.router.navigate(['/register'], {
      queryParams: {
        tipo: this.tipo
      }
    });

  }

}