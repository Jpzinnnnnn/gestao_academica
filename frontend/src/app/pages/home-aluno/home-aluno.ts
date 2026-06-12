import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Api } from '../../service/api';

@Component({
  selector: 'app-home-aluno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-aluno.html',
  styleUrl: './home-aluno.scss',
})
export class HomeAluno implements OnInit {
  user: any = {};
  constructor(private api: Api, private router: Router) { }
  ngOnInit(): void {

    const usuario = this.api.getUsuarioLogado();

    if (!usuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.nomeUsuario = usuario.nome;
    this.tipoUsuario = usuario.tipo_usuario;

    this.api.getUser(usuario.id).subscribe({
      next: (res: any) => {
        this.user = res;

        console.log('Usuário carregado:', res);
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.gerarCalendario();

    const sessao = localStorage.getItem('sessao_usuario');
    if (sessao) {
      const dados = JSON.parse(sessao);
      this.tipoUsuario = dados.tipo || 'aluno';
      this.nomeUsuario = dados.nome || 'Usuário';
    }
    this.gerarCalendario();
  }

  tipoUsuario: string = 'aluno';
  nomeUsuario: string = 'João Silva Santos';
  paginaAtiva: string = 'inicio';



  // ── INÍCIO
  mediaGeral = 8.5;
  frequencia = 92;
  proximaAvaliacao = 5;
  avisos = [
    'Período de matrículas para o próximo semestre: 01/06 a 15/06',
    'Prova substitutiva de Matemática marcada para 25/05',
    'Não haverá aula na próxima sexta-feira devido ao feriado'
  ];

  // ── MATRÍCULA
  documentos = [
    { nome: 'RG', data: '01/02/2024', status: 'Enviado' },
    { nome: 'CPF', data: '01/02/2024', status: 'Enviado' },
    { nome: 'Comprovante de Residência', data: '01/02/2024', status: 'Enviado' },
  ];

  // ── BOLETIM / DESEMPENHO
  disciplinas = [
    { nome: 'Matemática', n1: 8.5, n2: 7.0, n3: 9.0, media: 8.2, freq: 95, tendencia: 'up' },
    { nome: 'Português', n1: 9.0, n2: 8.5, n3: 9.5, media: 9.0, freq: 92, tendencia: 'up' },
    { nome: 'Física', n1: 7.5, n2: 8.0, n3: 7.0, media: 7.5, freq: 88, tendencia: 'down' }
  ];

  historicoEscolar = [
    { ano: '2º Ano – 2023', media: 8.7, freq: 94 },
    { ano: '1º Ano – 2022', media: 8.3, freq: 91 },
  ];

  // ── CALENDÁRIO
  anoAtual = new Date().getFullYear();
  mesAtual = new Date().getMonth();
  diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  diasCalendario: any[] = [];
  proximosEventos = [
    { nome: 'Prova de Matemática', data: '25/05', hora: '08:00–10:00', tipo: 'Prova' },
    { nome: 'Trabalho de História', data: '22/05', hora: '23:59', tipo: 'Trabalho' },
    { nome: 'Feira de Ciências', data: '01/06', hora: '09:00–17:00', tipo: 'Evento' }
  ];
  eventoDias = [1, 22, 25, 27];

  get mesAtualNome() {
    return ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][this.mesAtual];
  }

  gerarCalendario() {
    const hoje = new Date();
    const primeiro = new Date(this.anoAtual, this.mesAtual, 1);
    const ultimo = new Date(this.anoAtual, this.mesAtual + 1, 0);
    const dias: any[] = [];
    for (let i = 0; i < primeiro.getDay(); i++) {
      const d = new Date(this.anoAtual, this.mesAtual, -primeiro.getDay() + i + 1);
      dias.push({ num: d.getDate(), mesAtual: false, hoje: false, temEvento: false });
    }
    for (let d = 1; d <= ultimo.getDate(); d++) {
      dias.push({
        num: d, mesAtual: true,
        hoje: d === hoje.getDate() && this.mesAtual === hoje.getMonth() && this.anoAtual === hoje.getFullYear(),
        temEvento: this.eventoDias.includes(d)
      });
    }
    this.diasCalendario = dias;
  }

  mesAnterior() { this.mesAtual--; if (this.mesAtual < 0) { this.mesAtual = 11; this.anoAtual--; } this.gerarCalendario(); }
  proximoMes() { this.mesAtual++; if (this.mesAtual > 11) { this.mesAtual = 0; this.anoAtual++; } this.gerarCalendario(); }
  selecionarDia(_dia: any) { }

  // ── TAREFAS
  tarefas = [
    { nome: 'Trabalho de Matemática', disciplina: 'Matemática', descricao: 'Resolver exercícios do capítulo 5', prazo: '25/05/2026', prioridade: 'Alta', status: 'pendente' },
    { nome: 'Leitura de Português', disciplina: 'Português', descricao: 'Ler capítulo 10 do livro', prazo: '22/05/2026', prioridade: 'Média', status: 'concluida' },
    
  ];

  // ── BIBLIOTECA
  buscaBiblioteca = '';
  livros = [
    { titulo: 'Matemática Basica', autor: 'João Silva', categoria: 'Matemática', estrelas: 5, avaliacao: 4.5, status: 'Disponível', pdf: 'pdfs/matematica-basica.pdf'  },
    { titulo: 'Física Moderna', autor: 'Maria Santos', categoria: 'Física', estrelas: 5, avaliacao: 4.8, status: 'Disponível' },
    
  ];

  abrirPdf(pdf: string) {
    window.open(pdf, '_blank');
  }

  get livrosFiltrados() {
    const q = this.buscaBiblioteca.toLowerCase();
    return q ? this.livros.filter(l =>
      l.titulo.toLowerCase().includes(q) ||
      l.autor.toLowerCase().includes(q) ||
      l.categoria.toLowerCase().includes(q)) : this.livros;
  }

  // ── HORÁRIO
  horarioAulas = [
    {
      dia: 'Segunda-feira', aulas: [
        { disciplina: 'Matemática', professor: 'Prof. João Silva', sala: 'Sala 101', hora: '07:00 – 08:00', cor: '#3b82f6' },
        { disciplina: 'Português', professor: 'Profa. Maria Santos', sala: 'Sala 102', hora: '08:00 – 09:00', cor: '#16a34a' },
        { disciplina: 'Física', professor: 'Prof. Pedro Costa', sala: 'Sala 103', hora: '09:15 – 10:00', cor: '#f59e0b' },
        { disciplina: 'Química', professor: 'Profa. Ana Paula', sala: 'Sala 104', hora: '10:20 – 11:00', cor: '#ec4899' },
      ]
    },
    {
      dia: 'Terça-feira', aulas: [
        { disciplina: 'Biologia', professor: 'Profa. Fernanda Lima', sala: 'Sala 106', hora: '07:00 – 08:00', cor: '#16a34a' },
        { disciplina: 'Geografia', professor: 'Prof. Ricardo Alves', sala: 'Sala 107', hora: '08:00 – 09:10', cor: '#f59e0b' },
        { disciplina: 'Matemática', professor: 'Prof. João Silva', sala: 'Sala 101', hora: '09:10 – 10:00', cor: '#3b82f6' },
      ]
    },
    {
      dia: 'Quarta-feira', aulas: [
        { disciplina: 'Português', professor: 'Profa. Maria Santos', sala: 'Sala 102', hora: '07:00 – 08:00', cor: '#16a34a' },
        { disciplina: 'Física', professor: 'Prof. Pedro Costa', sala: 'Sala 103', hora: '08:00 – 09:10', cor: '#f59e0b' },
        { disciplina: 'Química', professor: 'Profa. Ana Paula', sala: 'Sala 104', hora: '09:10 – 10:00', cor: '#ec4899' },
      ]
    },
  ];

  // ── COMUNICADOS
  comunicados = [
    { titulo: 'Reunião de Pais – Junho 2026', data: '20/05/2026', texto: 'Comunicamos que a reunião de pais está agendada para o dia 10/06/2026 às 19h no auditório principal.', novo: true, cor: '#ef4444' },
    { titulo: 'Feriado Prolongado', data: '18/05/2026', texto: 'Não haverá aula nos dias 30 e 31/05 devido ao feriado prolongado.', novo: false, cor: '#3b82f6' },
    { titulo: 'Nova Biblioteca Digital', data: '15/05/2026', texto: 'Temos o prazer de anunciar a nova biblioteca digital com mais de 1000 títulos disponíveis.', novo: false, cor: '#16a34a' },
  ];

  // ── DOWNLOADS
  arquivos = [
    { nome: 'Apostila de Matemática – Capítulo 5', disciplina: 'Matemática', tamanho: '2.3 MB', data: '20/05/2026', cor: '#ef4444' },
    { nome: 'Vídeo Aula – Física Moderna', disciplina: 'Física', tamanho: '125 MB', data: '18/05/2026', cor: '#8b5cf6' },
    { nome: 'Lista de Exercícios – Química', disciplina: 'Química', tamanho: '1.8 MB', data: '15/05/2026', cor: '#ef4444' },
  ];

  // ── SUPORTE
  mensagemAssunto = '';
  mensagemTexto = '';
  faqs = [
    { pergunta: 'Como faço para alterar minha senha?', resposta: 'Acesse Perfil > Alterar Senha e siga os passos.', aberto: false },
    { pergunta: 'Onde encontro meu histórico escolar?', resposta: 'Acesse Boletim ou Perfil > Histórico Acadêmico.', aberto: false },
    { pergunta: 'Como baixo os materiais das aulas?', resposta: 'Acesse Área de Downloads e clique em Baixar.', aberto: false },
  ];
  toggleFaq(faq: any) { faq.aberto = !faq.aberto; }
  enviarMensagem() {
    if (this.mensagemAssunto && this.mensagemTexto) {
      alert('Mensagem enviada com sucesso!');
      this.mensagemAssunto = '';
      this.mensagemTexto = '';
    }
  }

  navegarPara(pagina: string) { this.paginaAtiva = pagina; }
  sair() { localStorage.removeItem('sessao_usuario'); this.router.navigate(['/login']); }
}