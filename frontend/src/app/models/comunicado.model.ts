export interface Comunicado {
    titulo: string;
    data: string;
    turma: string;
    texto: string;
    tag: 'importante' | 'informacao' | 'evento';
  }