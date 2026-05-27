import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss']
})
export class LandingPage {

  acessarAluno(){
    alert('Entrando como aluno');
  }

  acessarProfessor(){
    alert('Entrando como professor');
  }

}