import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss']
})
export class LandingPage {

  constructor(private router: Router) {}

  acessarAluno() {
    this.router.navigate(['/login'], {
      queryParams: {
        tipo: 'aluno'
      }
    });
  }

  acessarProfessor() {
    this.router.navigate(['/login'], {
      queryParams: {
        tipo: 'professor'
      }
    });
  }

}