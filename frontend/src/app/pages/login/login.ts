import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  ra: string = '';
  senha: string = '';

  tipo: string = 'aluno';

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

    console.log('Tipo:', this.tipo);
    console.log('RA/CPF:', this.ra);
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