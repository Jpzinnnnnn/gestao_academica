import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  ra: string = '';
  senha: string = '';

  login() {
    console.log('RA:', this.ra);
    console.log('Senha:', this.senha);

    alert('Login realizado!');
  }

}