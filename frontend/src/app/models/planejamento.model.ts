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