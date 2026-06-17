import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comunicado, ComunicadoService } from '../../service/comunicado';
import { Turma } from '../../models/turma.model';
import { Evento } from '../../models/evento.model';
import { AlunoNota } from '../../models/aluno-nota.model';
import { AlunoFrequencia } from '../../models/aluno-frequencia.model';
import { Material } from '../../models/material.model';
import { Planejamento } from '../../models/planejamento.model';
import { AtividadeRecente } from '../../models/atividade-recente.model';

@Component({
  selector: 'app-home-professor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-professor.html',
  styleUrl: './home-professor.scss',
})
export class HomeProfessor implements OnInit {

  // ── Página ativa ──────────────────────────────
  activePage: string = 'home';

  // ── Turmas disponíveis ────────────────────────
  turmas: Turma[] = [
    { id: '3A', label: '3A' },
    { id: '3B', label: '3B' },
    { id: '2A', label: '2A' },
  ];

  turmaSelecionadaNotas: string = '3A';
  turmaSelecionadaFreq: string = '3A';
  dataFrequencia: string = '2026-05-20';

  // ── Eventos da agenda ─────────────────────────
  eventos: Evento[] = [
    { titulo: 'Prova de Matemática', descricao: 'Avaliação sobre equações e funções', turma: '3º Ano A', data: '25/05', hora: '08:00 – 10:00', tipo: 'prova' }
  ];

  // ── Alunos notas ──────────────────────────────
  alunosNotas: AlunoNota[] = [
    { nome: 'Ana Silva',     ra: 'RA001', nota1: 8.5, nota2: 7.0, nota3: 9.0, media: 8.2, frequencia: '95%' }
  ];

  // ── Chamada ───────────────────────────────────
  chamada: AlunoFrequencia[] = [
    { ra: 'RA001', nome: 'Ana Silva',      presente: true  }
  ];

  get presentes(): number {
    return this.chamada.filter(a => a.presente).length;
  }

  get ausentes(): number {
    return this.chamada.filter(a => !a.presente).length;
  }

  // ── Materiais ─────────────────────────────────
  materiais: Material[] = [
    { nome: 'Apostila de Matemática - Capítulo 5', turma: '3º Ano A', tipo: 'PDF',  tamanho: '2.3 MB',  data: '20/05/2026' }
  ];

  novoMaterialTitulo: string = '';
  novoMaterialTurma: string = '';
  novoMaterialCategoria: string = '';

  // ── Comunicados ───────────────────────────────
  comunicados: Comunicado[] = [];


  // ── Planejamentos ─────────────────────────────
  planejamentos: Planejamento[] = [
    { titulo: 'Introdução às Funções', data: '25/05/2026', horario: '07:30 – 09:10', turma: '3º Ano A', status: 'planejada', objetivos: 'Apresentar o conceito de funções e suas aplicações práticas', metodologia: 'Aula expositiva com exemplos práticos e exercícios', recursos: 'Slides, quadro branco, calculadora' }
  ];

  // ── Painel / Atividades recentes ──────────────
  atividadesRecentes: AtividadeRecente[] = [
    { texto: 'Notas lançadas - 3º Ano A',       data: '20/05/2026 14:30', cor: 'g' }
  ];

  // ── Resumo relatórios ─────────────────────────
  resumoTurmas = [
    { turma: '3º Ano A', alunos: 28, media: 8.2, frequencia: '92%' }
  ];

  // ── Dias do calendário ────────────────────────
  calDays: (number | null)[] = [];
  eventDays: number[] = [22, 25, 30];

  // ── Perfil ────────────────────────────────────
  perfil = {
    nome: 'João Silva Santos',
    ra: '123456',
    curso: 'Engenharia de Software',
    ano: '3º Ano',
    email: 'joao.silva@email.com',
    telefone: '(11) 98765-4321',
    endereco: 'Rua das Flores, 123 – São Paulo, SP',
    nascimento: '15/03/2005',
  };

  historicoAcademico = [
    { ano: '3º Ano - 2024', curso: 'Engenharia de Software', media: 8.5, status: 'emcurso' }
  ];

  constructor(private router: Router,  private comunicadoService: ComunicadoService) {}

  ngOnInit(): void {
    this.buildCalendar();
    this.carregarComunicados();
  }



  carregarComunicados(): void {
    this.comunicadoService.getAll().subscribe({
      next: (dados) => {
        this.comunicados = dados;
      },
      error: (erro) => {
        console.error('Erro ao carregar comunicados', erro);
      }
    });
  }

  removerComunicado(id: number): void {
    this.comunicadoService.delete(id).subscribe({
      next: () => {
        this.carregarComunicados();
      },
      error: (erro) => {
        console.error('Erro ao remover comunicado', erro);
      }
    });
  }
  // ── Navegação ─────────────────────────────────
  goTo(page: string): void {
    this.activePage = page;
    window.scrollTo(0, 0);
  }

  isPage(page: string): boolean {
    return this.activePage === page;
  }

  // ── Tabs turma ────────────────────────────────
  selectTurmaNotas(id: string): void {
    this.turmaSelecionadaNotas = id;
  }

  selectTurmaFreq(id: string): void {
    this.turmaSelecionadaFreq = id;
  }

  // ── Frequência ────────────────────────────────
  setPresente(aluno: AlunoFrequencia, presente: boolean): void {
    aluno.presente = presente;
  }

  // ── Calendário ────────────────────────────────
  buildCalendar(): void {
    // Maio 2026 começa na sexta (índice 5)
    const startDay = 5;
    const totalDays = 31;
    this.calDays = [];
    for (let i = 0; i < startDay; i++) this.calDays.push(null);
    for (let d = 1; d <= totalDays; d++) this.calDays.push(d);
  }

  isToday(day: number | null): boolean {
    return day === 20;
  }

  hasEvent(day: number | null): boolean {
    return day !== null && this.eventDays.includes(day);
  }

  // ── Cor da média ──────────────────────────────
  mediaClass(media: number): string {
    return media >= 7 ? 'vg' : 'vb';
  }

  // ── Remover itens ─────────────────────────────
  removerMaterial(index: number): void {
    this.materiais.splice(index, 1);
  }


  removerPlanejamento(index: number): void {
    this.planejamentos.splice(index, 1);
  }

  removerEvento(index: number): void {
    this.eventos.splice(index, 1);
  }

  sair(): void {
    localStorage.removeItem('sessao_usuario');
    this.router.navigate(['/']);
  }
}