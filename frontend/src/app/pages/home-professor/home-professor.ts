import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Turma {
  id: string;
  label: string;
}

export interface AlunoFrequencia {
  ra: string;
  nome: string;
  presente: boolean;
}

export interface AlunoNota {
  nome: string;
  ra: string;
  nota1: number;
  nota2: number;
  nota3: number;
  media: number;
  frequencia: string;
}

export interface Evento {
  titulo: string;
  descricao: string;
  turma: string;
  data: string;
  hora: string;
  tipo: 'prova' | 'trabalho' | 'reuniao';
}

export interface Material {
  nome: string;
  turma: string;
  tipo: string;
  tamanho: string;
  data: string;
}

export interface Comunicado {
  titulo: string;
  data: string;
  turma: string;
  texto: string;
  tag: 'importante' | 'informacao' | 'evento';
}

export interface Planejamento {
  titulo: string;
  data: string;
  horario: string;
  turma: string;
  status: 'planejada' | 'realizada';
  objetivos: string;
  metodologia: string;
  recursos: string;
}

export interface AtividadeRecente {
  texto: string;
  data: string;
  cor: 'g' | 'b' | 'p' | 'o';
}

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
    { titulo: 'Prova de Matemática', descricao: 'Avaliação sobre equações e funções', turma: '3º Ano A', data: '25/05', hora: '08:00 – 10:00', tipo: 'prova' },
    { titulo: 'Trabalho de História', descricao: 'Entrega do trabalho sobre Revolução Industrial', turma: '2º Ano B', data: '22/05', hora: '21:59', tipo: 'trabalho' },
    { titulo: 'Reunião Pedagógica', descricao: 'Reunião com coordenação pedagógica', turma: 'Todos', data: '30/05', hora: '14:00 – 16:00', tipo: 'reuniao' },
  ];

  // ── Alunos notas ──────────────────────────────
  alunosNotas: AlunoNota[] = [
    { nome: 'Ana Silva',     ra: 'RA001', nota1: 8.5, nota2: 7.0, nota3: 9.0, media: 8.2, frequencia: '95%' },
    { nome: 'Bruno Santos',  ra: 'RA002', nota1: 7.0, nota2: 8.0, nota3: 7.5, media: 7.5, frequencia: '88%' },
    { nome: 'Carla Oliveira',ra: 'RA003', nota1: 9.0, nota2: 9.5, nota3: 9.0, media: 9.2, frequencia: '96%' },
  ];

  // ── Chamada ───────────────────────────────────
  chamada: AlunoFrequencia[] = [
    { ra: 'RA001', nome: 'Ana Silva',      presente: true  },
    { ra: 'RA002', nome: 'Bruno Santos',   presente: true  },
    { ra: 'RA003', nome: 'Carla Oliveira', presente: false }
  ];

  get presentes(): number {
    return this.chamada.filter(a => a.presente).length;
  }

  get ausentes(): number {
    return this.chamada.filter(a => !a.presente).length;
  }

  // ── Materiais ─────────────────────────────────
  materiais: Material[] = [
    { nome: 'Apostila de Matemática - Capítulo 5', turma: '3º Ano A', tipo: 'PDF',  tamanho: '2.3 MB',  data: '20/05/2026' },
    { nome: 'Lista de Exercícios - Equações',      turma: '3º Ano B', tipo: 'PDF',  tamanho: '1.8 MB',  data: '18/05/2026' },
    { nome: 'Slides - Funções',                    turma: '2º Ano A', tipo: 'PPTX', tamanho: '5.2 MB',  data: '15/05/2026' },
  ];

  novoMaterialTitulo: string = '';
  novoMaterialTurma: string = '';
  novoMaterialCategoria: string = '';

  // ── Comunicados ───────────────────────────────
  comunicados: Comunicado[] = [
    { titulo: 'Prova de Matemática - Capítulo 5', data: '20/05/2026', turma: '3º Ano A e B', texto: 'A prova do capítulo 5 será realizada na próxima semana.', tag: 'importante' },
    { titulo: 'Material Disponível',              data: '18/05/2026', turma: 'Todas as Turmas', texto: 'Novo material de estudos disponível na área de downloads.', tag: 'informacao' },
    { titulo: 'Aula Extra - Trigonometria',       data: '15/05/2026', turma: '2º Ano A',  texto: 'Aula extra de trigonometria agendada para sábado, 25/05.', tag: 'evento' },
  ];

  // ── Planejamentos ─────────────────────────────
  planejamentos: Planejamento[] = [
    { titulo: 'Introdução às Funções', data: '25/05/2026', horario: '07:30 – 09:10', turma: '3º Ano A', status: 'planejada', objetivos: 'Apresentar o conceito de funções e suas aplicações práticas', metodologia: 'Aula expositiva com exemplos práticos e exercícios', recursos: 'Slides, quadro branco, calculadora' },
    { titulo: 'Equações do 2º Grau',   data: '22/05/2026', horario: '10:20 – 12:00', turma: '2º Ano A', status: 'realizada', objetivos: 'Resolver equações do segundo grau usando fórmula de Bhaskara', metodologia: 'Resolução de exercícios em grupo', recursos: 'Lista de exercícios, apostila' },
    { titulo: 'Trigonometria Básica',  data: '28/05/2026', horario: '13:30 – 15:10', turma: '1º Ano B', status: 'planejada', objetivos: 'Compreender as razões trigonométricas básicas', metodologia: 'Aula prática com medições', recursos: 'Transferidor, régua, apostila' },
  ];

  // ── Painel / Atividades recentes ──────────────
  atividadesRecentes: AtividadeRecente[] = [
    { texto: 'Notas lançadas - 3º Ano A',       data: '20/05/2026 14:30', cor: 'g' },
    { texto: 'Material enviado - Apostila Cap. 5', data: '20/05/2026 11:15', cor: 'b' },
    { texto: 'Frequência registrada - 2º Ano B', data: '19/05/2026 16:45', cor: 'p' }
  ];

  // ── Resumo relatórios ─────────────────────────
  resumoTurmas = [
    { turma: '3º Ano A', alunos: 28, media: 8.2, frequencia: '92%' },
    { turma: '3º Ano B', alunos: 26, media: 7.8, frequencia: '89%' },
    { turma: '2º Ano A', alunos: 30, media: 8.5, frequencia: '94%' }
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
    { ano: '3º Ano - 2024', curso: 'Engenharia de Software', media: 8.5, status: 'emcurso' },
    { ano: '2º Ano - 2023', curso: 'Engenharia de Software', media: 8.7, status: 'aprovado' },
    { ano: '1º Ano - 2022', curso: 'Engenharia de Software', media: 8.3, status: 'aprovado' },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildCalendar();
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

  removerComunicado(index: number): void {
    this.comunicados.splice(index, 1);
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