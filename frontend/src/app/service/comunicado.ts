import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comunicado {
    id?: number;
    professor_id?: number;
    titulo: string;
    mensagem: string;
    data_publicacao: string;
    turma: string;
    tipo: 'importante' | 'informacao' | 'evento';
  }

@Injectable({
  providedIn: 'root'
})
export class ComunicadoService {

  private apiUrl = 'http://localhost:3000/comunicados';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Comunicado[]> {
    return this.http.get<Comunicado[]>(this.apiUrl);
  }

  getById(id: number): Observable<Comunicado> {
    return this.http.get<Comunicado>(`${this.apiUrl}/${id}`);
  }

  create(comunicado: Comunicado): Observable<any> {
    return this.http.post(this.apiUrl, comunicado);
  }

  update(id: number, comunicado: Comunicado): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, comunicado);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}