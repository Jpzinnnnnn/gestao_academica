export interface Evento {
    titulo: string;
    descricao: string;
    turma: string;
    data: string;
    hora: string;
    tipo: 'prova' | 'trabalho' | 'reuniao';
  }